const container = document.querySelector('.lens-container');
const totalButtons = 32;
const url_api='http://localhost:3003';
draw_button();
update_btn_status;
    
function draw_button()
{
    container.innerHTML = "";
    // Các vòng tròn chia hình tròn (vòng ngoài cùng tiếp xúc nút ngoài cùng)
    circleRadii = getScaledRadii(); 
    // Đặt nút nằm giữa các vòng tròn → ở trung điểm mỗi vùng
    const buttonRadii = [
      (circleRadii[0]) / 1.5,                       // giữa tâm và vòng đầu
      (circleRadii[0] + circleRadii[1]) / 2,      // giữa vòng 1 & 2
      (circleRadii[1] + circleRadii[2]) / 2,      // giữa vòng 2 & 3
      (circleRadii[2] + circleRadii[3]) / 2       // giữa vòng 3 & ngoài cùng
    ];
    let index = 0;
    // Tạo 32 nút
    for (let r = 0; r < buttonRadii.length; r++) {
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45 + 22.5) * Math.PI / 180; // xoay 22.5°
        const x = buttonRadii[r] * Math.cos(angle);
        const y = buttonRadii[r] * Math.sin(angle);

        const btn = document.createElement('button');
        index++;
        btn.classList.add('circle-btn');
        btn.id = `btn${index}`;
        btn.name = `btn${index}`;
        btn.textContent = index;
        btn.style.left = `calc(50% + ${x}px)`;
        btn.style.top = `calc(50% + ${y}px)`;
        container.appendChild(btn);
      }
    }
}

function getScaledRadii() {
  const baseWidth = 150;
  const containerWidth = document.querySelector('.lens-container').offsetWidth;
  const scale = containerWidth / baseWidth;
  return [100, 140, 210, 270].map(r => r * scale);
}
window.addEventListener('resize', () => {
  draw_button();
});

//Phần logic các nút nhấn

const submit = document.getElementById('submitBtn');

//Tạo mảng thôn gtin các nút
let btn_status =[];
for (i=0;i<32;i++){
    btn_status[i]=false;
}
console.log(btn_status);

//tạo sự kiện cho các nút
for (let i = 1; i <= 32; i++) {
  const nut = document.getElementById(`btn${i}`);
  nut.addEventListener('click', () => {
    console.log(`Bạn vừa click nút ${i}`);
    // Thêm xử lý riêng ở đây nè
    btn_status[i-1]=!btn_status[i-1];
    console.log(btn_status);
    update_btn_status();
  });
}



function update_btn_status() {
  for (let i = 0; i < 32; i++) {
    const btn = document.getElementById(`btn${i + 1}`);
    if(btn){
    if (btn_status[i]) {
        btn.style.backgroundColor = 'red';
    } else {
        btn.style.backgroundColor = 'green';
    }
    }
  }
}
//phần logic cho các nút nhấn
async function save_defect_position(json_data) {
  if (json_data.length > 0) {
    try {
      const response = await fetch(url_api+'/defectposition?yeucau=savedefectposition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert('Defect position saved!');
      console.log('Server response:', data);
    } catch (error) {
      alert('Save failed! ' + error);
      console.error('Error details:', error);
    }
  }
}

submit.addEventListener('click', function(){
  save_defect_position(btn_status);
})