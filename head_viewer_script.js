// 使用正確的 CDN 導入 Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 設置場景、相機和渲染器
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x666666);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// 創建控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
// 設置無限旋轉 - 移除限制
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;
controls.enablePan = false; // 禁用平移以避免一些潛在的衝突

// 創建頭部組對象
let head = null;
// 旋轉動畫狀態
let rotationAnimation = {
  active: false,
  axis: null,
  speed: 0.02
};

// 頭部初始位置
const initialHeadRotation = {
  x: 0,
  y: 0,
  z: 0
};

// 處理上傳皮膚並創建頭部模型
function handleSkinUpload(file) {
  const reader = new FileReader();
  
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // 檢查圖像尺寸是否為64x64
      if (img.width !== 64 || img.height !== 64) {
        alert('請上傳64x64像素的Minecraft皮膚圖片！');
        return;
      }
      
      // 創建畫布以從圖像中提取紋理
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // 如果場景中已有頭部，則移除
      if (head) {
        scene.remove(head);
      }
      
      // 創建新的頭部
      head = createHead(canvas);
      resetHeadPosition(); // 重置頭部到初始位置
      scene.add(head);
    };
    img.src = event.target.result;
  };
  
  reader.readAsDataURL(file);
}

// 從畫布上獲取特定區域的紋理
function getTextureFromArea(canvas, x, y, width, height) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext('2d');
  
  // 從源畫布複製區域
  ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
  
  const texture = new THREE.CanvasTexture(tempCanvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  
  return texture;
}

// 創建頭部的函數
function createHead(canvas) {
  const headGroup = new THREE.Group();
  const size = 2; // 頭部大小
  
  // 基於區域位置創建頭部面
  // 根據Minecraft皮膚貼圖的UV映射提取紋理
  
  // 頭頂部 x為8~15 y為0~7
  const topTexture = getTextureFromArea(canvas, 8, 0, 8, 8);
  
  // 頭底部 x為16~23 y為0~7
  const bottomTexture = getTextureFromArea(canvas, 16, 0, 8, 8);
  bottomTexture.rotation = Math.PI;
  bottomTexture.flipY = false;
  
  // 頭右邊 x為0~7 y為8~15
  const rightTexture = getTextureFromArea(canvas, 16, 8, 8, 8);
  
  // 頭正面 x為8~15 y為8~15
  const frontTexture = getTextureFromArea(canvas, 8, 8, 8, 8);
  
  // 頭左邊 x為16~23 y為8~15
  const leftTexture = getTextureFromArea(canvas, 0, 8, 8, 8);
  
  // 頭後面 x為24~31 y為8~15
  const backTexture = getTextureFromArea(canvas, 24, 8, 8, 8);
  
  // 創建材質
  const materials = [
    new THREE.MeshBasicMaterial({ map: rightTexture }),  // 右面
    new THREE.MeshBasicMaterial({ map: leftTexture }),   // 左面
    new THREE.MeshBasicMaterial({ map: topTexture }),    // 頂面
    new THREE.MeshBasicMaterial({ map: bottomTexture }), // 底面
    new THREE.MeshBasicMaterial({ map: frontTexture }),  // 正面
    new THREE.MeshBasicMaterial({ map: backTexture })    // 後面
  ];
  
  // 創建立方體
  const geometry = new THREE.BoxGeometry(size, size, size);
  
  // 將所有面材質應用到幾何體上
  const cube = new THREE.Mesh(geometry, materials);
  
  // 將立方體添加到頭部組
  headGroup.add(cube);
  
  return headGroup;
}

// 創建旋轉控制按鈕和重置按鈕
function createControlButtons() {
  const buttonContainer = document.createElement('div');
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.right = '20px';
  buttonContainer.style.top = '50%';
  buttonContainer.style.transform = 'translateY(-50%)';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.flexDirection = 'column';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.zIndex = '100';
  
  const axes = [
    { name: 'X軸旋轉', axis: 'x', color: '#FF5555' },
    { name: 'Y軸旋轉', axis: 'y', color: '#55AA55' },
    { name: 'Z軸旋轉', axis: 'z', color: '#5555FF' }
  ];
  
  axes.forEach(axisInfo => {
    const button = document.createElement('button');
    button.textContent = axisInfo.name;
    button.style.padding = '10px 15px';
    button.style.backgroundColor = axisInfo.color;
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    
    button.addEventListener('click', () => {
      // 如果點擊已經激活的軸，則停止旋轉
      if (rotationAnimation.active && rotationAnimation.axis === axisInfo.axis) {
        rotationAnimation.active = false;
        button.style.opacity = '1';
      } else {
        // 停止其他旋轉並啟動新的旋轉
        rotationAnimation.active = true;
        rotationAnimation.axis = axisInfo.axis;
        
        // 重置所有按鈕樣式
        buttonContainer.querySelectorAll('button').forEach(btn => {
          btn.style.opacity = '1';
        });
        
        // 突出顯示當前按鈕
        button.style.opacity = '0.7';
      }
    });
    
    buttonContainer.appendChild(button);
  });
  
  // 添加重置按鈕
  const resetButton = document.createElement('button');
  resetButton.textContent = '重置位置';
  resetButton.style.padding = '10px 15px';
  resetButton.style.backgroundColor = '#FF9900';
  resetButton.style.color = 'white';
  resetButton.style.border = 'none';
  resetButton.style.borderRadius = '5px';
  resetButton.style.cursor = 'pointer';
  resetButton.style.marginTop = '20px';
  resetButton.style.fontWeight = 'bold';
  resetButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  
  resetButton.addEventListener('click', () => {
    resetHeadPosition();
    // 停止任何旋轉動畫
    rotationAnimation.active = false;
    // 重置所有按鈕樣式
    buttonContainer.querySelectorAll('button').forEach(btn => {
      btn.style.opacity = '1';
    });
  });
  
  buttonContainer.appendChild(resetButton);
  document.getElementById('container').appendChild(buttonContainer);
}

// 重置頭部位置
function resetHeadPosition() {
  if (head) {
    head.rotation.set(initialHeadRotation.x, initialHeadRotation.y, initialHeadRotation.z);
    // 同時重置控制器視角
    controls.reset();
  }
}

// 實現設備方向感應控制
function initOrientationControl() {
  // 檢查是否支持 Generic Sensor API
  if (window.DeviceOrientationEvent && /Android/i.test(navigator.userAgent) && /Chrome/i.test(navigator.userAgent)) {
    window.addEventListener('deviceorientation', handleOrientation, true);
    
    // 顯示設備方向控制提示
    const orientationInfo = document.createElement('div');
    orientationInfo.id = 'orientationInfo';
    orientationInfo.style.position = 'fixed';
    orientationInfo.style.bottom = '80px';
    orientationInfo.style.left = '50%';
    orientationInfo.style.transform = 'translateX(-50%)';
    orientationInfo.style.backgroundColor = 'rgba(0,0,0,0.5)';
    orientationInfo.style.color = 'white';
    orientationInfo.style.padding = '5px 10px';
    orientationInfo.style.borderRadius = '5px';
    orientationInfo.style.zIndex = '100';
    orientationInfo.style.textAlign = 'center';
    orientationInfo.textContent = '左右移動手機來控制頭部旋轉';
    
    document.getElementById('container').appendChild(orientationInfo);
  }
}

let lastGamma = 0;
function handleOrientation(event) {
  if (head && event.gamma !== null) {
    // 如果自動旋轉開啟則不使用方向控制
    if (rotationAnimation.active) return;
    
    // 只對 gamma 值的較大變化做出反應，避免過於敏感
    const gammaChange = event.gamma - lastGamma;
    if (Math.abs(gammaChange) > 1) {
      // 使用 gamma（左右傾斜）來旋轉頭部
      head.rotation.y += gammaChange * 0.02;
      lastGamma = event.gamma;
    }
  }
}

// 處理手機多點觸控旋轉
function initMultiTouchControl() {
  let lastDistance = 0;
  let lastAngle = 0;
  let startRotationY = 0;
  let startRotationX = 0;
  let startRotationZ = 0;
  let isTwoFingerTouch = false;

  document.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      isTwoFingerTouch = true;
      
      // 記錄起始角度
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastAngle = Math.atan2(dy, dx);
      
      // 記錄頭部當前旋轉
      if (head) {
        startRotationY = head.rotation.y;
        startRotationX = head.rotation.x;
        startRotationZ = head.rotation.z;
      }
      
      // 阻止OrbitControls干擾
      controls.enabled = false;
    }
  });

  document.addEventListener('touchmove', function(e) {
    if (isTwoFingerTouch && e.touches.length === 2 && head) {
      // 防止頁面滾動
      e.preventDefault();
      
      // 計算兩指角度變化
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentAngle = Math.atan2(dy, dx);
      const angleDiff = currentAngle - lastAngle;
      
      // 使用角度差來旋轉頭部
      head.rotation.z = startRotationZ + angleDiff;
      
      // 計算兩指間距離變化用於X軸旋轉
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (lastDistance > 0) {
        const distanceDiff = distance - lastDistance;
        // 距離變化控制X軸旋轉
        head.rotation.x = startRotationX + distanceDiff * 0.01;
      }
      
      lastDistance = distance;
    }
  }, { passive: false });

  document.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) {
      isTwoFingerTouch = false;
      lastDistance = 0;
      // 恢復OrbitControls
      controls.enabled = true;
    }
  });
}

// 優化響應式界面
function optimizeForMobile() {
  const isMobile = window.innerWidth <= 768;
  
  // 上傳按鈕
  const uploadBtn = document.getElementById('uploadBtn');
  uploadBtn.style.bottom = isMobile ? '80px' : '20px';
  uploadBtn.style.zIndex = '100';
  
  // 信息面板
  const info = document.getElementById('info');
  info.style.fontSize = isMobile ? '14px' : '16px';
  info.style.padding = isMobile ? '8px 5px' : '5px';
  
  // 調整方向提示位置
  const orientationInfo = document.getElementById('orientationInfo');
  if (orientationInfo) {
    orientationInfo.style.bottom = isMobile ? '130px' : '80px';
  }
}

// 事件監聽器
document.getElementById('uploadBtn').addEventListener('click', function() {
  document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(e) {
  if (e.target.files.length > 0) {
    handleSkinUpload(e.target.files[0]);
  }
});

// 窗口大小變化時調整
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  optimizeForMobile();
});

// 渲染循環
function animate() {
  requestAnimationFrame(animate);
  
  // 如果旋轉動畫開啟，則旋轉頭部
  if (head && rotationAnimation.active) {
    switch (rotationAnimation.axis) {
      case 'x':
        head.rotation.x += rotationAnimation.speed;
        break;
      case 'y':
        head.rotation.y += rotationAnimation.speed;
        break;
      case 'z':
        head.rotation.z += rotationAnimation.speed;
        break;
    }
  }
  
  controls.update();
  renderer.render(scene, camera);
}

// 初始化時載入默認皮膚
function loadDefaultSkin() {
  // 使用來自可靠CDN的默認Steve皮膚
  const defaultSkinUrl = 'https://minecraft.wiki/images/Steve_%28classic_texture%29_JE6.png?8aa86';
  
  const defaultSkin = new Image();
  defaultSkin.crossOrigin = "Anonymous";
  defaultSkin.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(defaultSkin, 0, 0);
    
    head = createHead(canvas);
    scene.add(head);
  };
  defaultSkin.src = defaultSkinUrl;
}

// 初始化
loadDefaultSkin();
createControlButtons();
initOrientationControl();
initMultiTouchControl();
optimizeForMobile();

animate();