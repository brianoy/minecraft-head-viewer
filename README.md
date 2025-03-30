# minecraft-head-viewer
A simple Minecraft head texture viewer built using Three.js! Display and interact with Minecraft-style head textures in 3D, rotate smoothly, and explore how texture mapping works in real-time.

![270x270 (2)](https://github.com/user-attachments/assets/eb446fec-8ce8-48d3-92d3-df1db1bc73ec)

**This demo was recorded from a browser using screen recording. Afterward, I edited it in Premiere to remove the background and exported it as a 270x270 GIF at 50 FPS using the optical flow frame interpolation method.**

# ✨ Features
3D Rendering: View Minecraft skin textures mapped onto a 3D model (cube).

Smooth Animation: Textured head rotates smoothly on the Y and Z axes with an oscillating effect.

Anti-aliasing: Ensures smooth edges and clean rendering even during fast rotations.

# 🔧 Usage
### Clone the repository:

`git clone https://github.com/your-username/minecraft-head-textures-viewer.git`

### Open the project:

Important: To run this project, you must serve it through a local or remote server. Simply opening the index.html file directly in your browser may cause certain features (like device orientation) to not work.

You can use VS Code Live Server, http-server, or any other local server tool to serve the project.


### Mobile Device Functionality

If you intend to use mobile features like device orientation (for tilt/rotation), make sure the website is served over HTTPS.

HTTP will prevent access to device orientation APIs on most mobile devices due to security restrictions.

For local testing, use tools like ngrok to create an HTTPS tunnel for your local server.

### Modify Textures

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
