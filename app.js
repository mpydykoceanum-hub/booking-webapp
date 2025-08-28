// === ИНИЦИАЛИЗАЦИЯ TELEGRAM WEBAPP ===
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.MainButton.setParams({ text: 'Записаться', color: getComputedStyle(document.documentElement).getPropertyValue('--btn').trim() || '#2cab37', text_color: '#ffffff' });
    tg.MainButton.hide();
}


// === МОК-КОНФИГ ДЛЯ ШАГА 1 ===
const SERVICES = [
    { id: 'massage', title: 'Массаж (60 мин)' },
    { id: 'consult', title: 'Консультация (30 мин)' },
    { id: 'therapy', title: 'Терапия (90 мин)' }
];
const WORK_START = 10, WORK_END = 18, STEP_MIN = 30;
const BUSY = {};


const $service = document.getElementById('service');
const $date = document.getElementById('date');
const $phone = document.getElementById('phone');
const $times = document.getElementById('times');
const $err = document.getElementById('err');


SERVICES.forEach(s => {
    const opt = document.createElement('option'); opt.value = s.id; opt.textContent = s.title; $service.appendChild(opt);
});


const todayISO = new Date().toISOString().slice(0,10);
$date.value = todayISO; $date.min = todayISO;


function pad(n){ return String(n).padStart(2,'0'); }
function buildSlots(){
    const slots = [];
    for (let h=WORK_START; h<WORK_END; h++){
        for (let m=0; m<60; m+=STEP_MIN){ slots.push(`${pad(h)}:${pad(m)}`); }
    }
    return slots;
}


function renderTimes(){
    $times.innerHTML = '';
    const dateKey = $date.value;
    const busy = BUSY[dateKey] || [];
    buildSlots().forEach(time => {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'time'; btn.textContent = time;
        const isBusy = busy.includes(time);
        if (isBusy) btn.disabled = true;
        btn.addEventListener('click', () => selectTime(time, btn));
        $times.appendChild(btn);
    });
    selectedTime = null; toggleMain(false);
}


let selectedTime = null;
function selectTime(time, el){
    if (el?.disabled) return;
    selectedTime = time;
    [...$times.children].forEach(n => n.classList.remove('active'));
    el.classList.add('active');
    toggleMain(true);
}


function showError(msg){ $err.textContent = msg; $err.classList.toggle('hidden', !msg); }
function toggleMain(on){ if(!tg) return; tg.MainButton[on? 'show':'hide'](); }
$date.addEventListener('change', renderTimes);


try {
    const user = tg?.initDataUnsafe?.user;
    if (user?.phone_number && !$phone.value) $phone.value = user.phone_number;
} catch(_){ }


renderTimes();


if (tg){
    tg.onEvent('mainButtonClicked', () => {
        if (!$service.value) return showError('Выберите услугу');
        if (!$date.value) return showError('Выберите дату');
        if (!selectedTime) return showError('Выберите время');
        if (!$phone.value.trim()) return showError('Укажите телефон для связи');
        showError('');
        const payload = {
            service: $service.value,
            date: $date.value,
            time: selectedTime,
            phone: $phone.value.trim(),
            source: 'webapp',
        };
        tg.sendData(JSON.stringify(payload));
        tg.HapticFeedback?.impactOccurred('light');
        tg.showPopup?.({ title: 'Заявка отправлена', message: `Мы свяжемся с вами для подтверждения.`, buttons: [{type:'ok'}] });
    });
}