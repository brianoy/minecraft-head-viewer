# minecraft-head-viewer
A simple Minecraft head texture viewer built using Three.js! Display and interact with Minecraft-style head textures in 3D, rotate smoothly, and explore how texture mapping works in real-time.

![270x270 (2)](https://github.com/user-attachments/assets/eb446fec-8ce8-48d3-92d3-df1db1bc73ec)

**This demo was recorded from a browser using screen recording. Afterward, I edited it in Premiere to remove the background and exported it as a 270x270 GIF at 50 FPS using the optical flow frame interpolation method.**

# ✨ Features
3D Rendering: View Minecraft skin textures mapped onto a 3D model (cube).

Smooth Animation: Textured head rotates smoothly on the Y and Z axes with an oscillating effect.

Anti-aliasing: Ensures smooth edges and clean rendering even during fast rotations.

Interactive: Supports future features accelerometer

| 功能            | Android Chrome | Apple Safari | Apple Chrome |
|---------------|:--------------:|:------------:|:------------:|
| 加速計轉動    | ✅ >chrome 67 支援        | ❌ 不支援    | ❌ 不支援    |

# 🔧 Usage
### Clone the repository

`git clone https://github.com/your-username/minecraft-head-textures-viewer.git`

### Open the project

Important: To run this project, you must serve it through a local or remote server. Simply opening the index.html file directly in your browser may cause certain features (like three.js) to not work.

You can use VS Code Live Server, http-server, or any other local server tool to serve the project.


### Mobile Device Functionality

If you intend to use mobile features like device orientation (for rotation), make sure the website is served over HTTPS.

HTTP will prevent access to device orientation APIs on most mobile devices due to security restrictions.

For local testing, use tools like ngrok to create an HTTPS tunnel for your local server or you can use Python code to start an HTTPS server locally.

Generate the certificate in the cmd, and fill in the information according to the steps to generate the server.pem file
```bash
openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes
```

Run this python code to host a https server locally
```python
import http.server
import ssl

PORT = 4443
Handler = http.server.SimpleHTTPRequestHandler

httpd = http.server.HTTPServer(("0.0.0.0", PORT), Handler)

# 使用 SSLContext
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile="server.pem")

httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print(f"Serving HTTPS on port {PORT}")
httpd.serve_forever()
```

Then, Browse `https://localhost:4443/index.html`.

### Modify Skin Textures

To use your custom textures, replace the texture path in `head_viewer_script.js` at `defaultSkinUrl`, or just read the file in your computer.

# ⚙️ How It Works
Three.js handles rendering and texture mapping of a cube with Minecraft-style head textures.

The cube rotates on the Y and Z axes, oscillating between 0 and 0.2 radians, giving it a dynamic, smooth animation.

Anti-aliasing and anisotropic filtering improve the overall visual quality.

# 🎨 Customize

Background color: Modify the scene.background or renderer.setClearColor() to set a custom background.

# 📄 License
This project is open-source under GPL-3.0 license.

# 👾 Contribute
Feel free to open issues, and submit pull requests for enhancements and fixes. Contributions are welcome!
