import { Context, Hono } from 'hono'
import qr from "qr-image"

const app = new Hono()

app.all('/', (c) => {
  if (c.req.method == 'POST') return generateQRCode(c);

  return c.html(landing);
})



const generateQRCode = async (c: Context ) => {
  const {text} = await c.req.json();
  c.header('Content-Type', 'image/png');
  const qr_png = qr.imageSync(text || "https://workers.dev");
  return c.body(qr_png);
}

const landing = `
<h1>QR Generator</h1>
<p>Click the below button to generate a new QR code. This will make a request to your Worker.</p>
<input type="text" id="text" value="https://workers.dev"></input>
<button onclick="generate()">Generate QR Code</button>
<p>Generated QR Code Image</p>
<img id="qr" src="#" />
<script>
	function generate() {
		fetch(window.location.pathname, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text: document.querySelector("#text").value })
		})
		.then(response => response.blob())
		.then(blob => {
			const reader = new FileReader();
			reader.onloadend = function () {
				document.querySelector("#qr").src = reader.result; // Update the image source with the newly generated QR code
			}
			reader.readAsDataURL(blob);
		})
	}
</script>
`
  

export default app
