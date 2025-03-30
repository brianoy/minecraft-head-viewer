# minecraft-head-viewer
A simple Minecraft head texture viewer built using Three.js! Display and interact with Minecraft-style head textures in 3D, rotate smoothly, and explore how texture mapping works in real-time.

Perfect for developers learning Three.js, WebGL, or those interested in creating Minecraft-related 3D applications!

# ✨ Features
3D Rendering: View Minecraft head textures mapped onto a 3D model (cube).

Smooth Animation: Textured head rotates smoothly on the Y and Z axes with an oscillating effect.

Anti-aliasing: Ensures smooth edges and clean rendering even during fast rotations.

Customizable Background: Easily set a background color (e.g., blue #0000FF).

Interactive: Supports future features like mouse tracking and additional animations.

# 🔧 Usage
## Clone the repository:

`git clone https://github.com/your-username/minecraft-head-textures-viewer.git`

## Open the project:

Important: To run this project, you must serve it through a local or remote server. Simply opening the index.html file directly in your browser may cause certain features (like device orientation) to not work.

You can use VS Code Live Server, http-server, or any other local server tool to serve the project.


## Mobile Device Functionality

If you intend to use mobile features like device orientation (for tilt/rotation), make sure the website is served over HTTPS.

HTTP will prevent access to device orientation APIs on most mobile devices due to security restrictions.

For local testing, use tools like ngrok to create an HTTPS tunnel for your local server.

## Modify Textures

To use your custom textures, replace the texture path in `head_viewer_script.js` at `defaultSkinUrl`, or just read the file in your computer.

# ⚙️ How It Works
Three.js handles rendering and texture mapping of a cube with Minecraft-style head textures.

The cube rotates on the Y and Z axes, oscillating between 0 and 0.2 radians, giving it a dynamic, smooth animation.

Anti-aliasing and anisotropic filtering improve the overall visual quality.

# 🎨 Customize
Change textures: Replace the texture images with your own Minecraft head textures.

Background color: Modify the scene.background or renderer.setClearColor() to set a custom background.

# 📄 License
This project is open-source under GPL-3.0 license.

# 👾 Contribute
Feel free to open issues, fork the repository, and submit pull requests for enhancements and fixes. Contributions are welcome!
