function View () {      //начало View
    let element = null,     //ссылка на элемент хтмл
        bufferCanvas = null,    //ссылка на буфканвас
        canvas = null,  //ссылка на канвас
        ctx = null, //ссылка на контекст канваса
        bufferCtx = null, //ссылка на контекст буф канваса
        backgroundMusic = null;
        //меню
    const menuLinks = { //вёрстка меню
        main : `<span><img src="assets/list.png" width="64" height="64" alt="Play"><a href="#play">Play</a></span></br>
                <span><img src="assets/gear.png" width="64" height="64" alt="Settings"><a href="#settings">Settings</a></span></br>
                <span><img src="assets/bulb.png" width="64" height="64" alt="score"><a href="#score">Score</a></span></br>
                <span><img src="assets/exit.png" width="64" height="64" alt="exit"><a href="#exit">Exit</a></span></br>`,
        settings : `<span>Volume</span></br>
                <input type="range" min="0" max ="1" step="0.1" value="0.4"></br>
                <span><a href="#main">Back to Menu</a></span>`,
        score : `<span>Last score:</span></br>
                <span id="name"></span></br>
                <span id="score"></span></br>
                <span><a href="#main">Back to Menu</a></span>`,
        exit : `<p>Thanks for playing!</p>
                <span><a href="#main">Back to Menu</a></span>`,
        over : `<span>GAME</span></br>
                <span>OVER</span></br>
                <span><a href="#main">Back to Menu</a></span>`
    };
        //инит методы
    this.init = function(el){ //функция инициализации
        element = el;   //привязываем
    };
    this.setCanvas = function(canv, buffer, ct, buffCtx){    //функции инициализации канваса  
        canvas = canv, bufferCanvas = buffer, ctx = ct, bufferCtx = buffCtx;
    };
    this.extractFromBuffer = function(){   //функция извлечения информации из буфера
        ctx.drawImage(bufferCanvas, 0, 0, canvas.width, canvas.height);
    };
        //приватные методы
    function shake (intensity) {    //функция на "тряску"
        bufferCtx.drawImage(bufferCanvas, Math.round(Math.random() * intensity), Math.round(Math.random() * intensity), canvas.width, canvas.height);
    };
        //функции бэкграунда
    this.drawBackGround = function(bgColor){  //функция отрисовки бг
        bufferCtx.fillStyle = bgColor; //устанавливаем цвет из настроек
        bufferCtx.fillRect(0, 0, bufferCanvas.width, bufferCanvas.height); //устанавливаем размеры отрисовки в размеры канваса
    };
    this.drawBgObj = function(objArray){    //функция отрисовки обьектов бг
        for (i in objArray){//цикл на отрисовку всех обьектов
            bufferCtx.beginPath(); //начинаем отрисовку круга
            bufferCtx.fillStyle = objArray[i].color; //задаем цвет обьекта
            bufferCtx.arc(objArray[i].x, objArray[i].y, objArray[i].radius, 0, 2*Math.PI); //отрисовываем круг
            bufferCtx.fill();    //заливаем круг
        };  //отрисовываем все обьекты в буфферном канвасе
    };
        //функции обьектов
    this.drawObj = function (objArray, frame, size){    //функция отрисовки обьектов
        let objImg = new Image(); objImg.src = frame; //создаем новый имг и привязываем ему ссылку на спрайт обьекта
        for(i in objArray){
            bufferCtx.drawImage(objImg, Math.round(objArray[i].animFrame)*128, objArray[i].frameType*128,  128, 128, objArray[i].x, objArray[i].y, size, size);
        };
    };
        //функции игрока
    this.drawPlayer = function(x, y, size, frame) {    //функция отрисовки игрока
        let playerImg = new Image(); playerImg.src = frame;  //создаем новый имг и привязываем ему ссылку на спрайт
            bufferCtx.drawImage(playerImg, x, y, size, size);
    };
    this.drawHud = function(score, life) {   //функция отрисовки HUD
        bufferCtx.font = '48px Impact';    //установки текста
        bufferCtx.textAlign = 'center';
        bufferCtx.verticalAlign = 'middle';
        bufferCtx.fillText(`Score: ${score}`, bufferCtx.canvas.width / 2, bufferCtx.canvas.height / 10)
        bufferCtx.fillText(`\u26E8`.repeat(life), bufferCtx.canvas.width / 10, bufferCtx.canvas.height / 10)
    };
    this.drawProjectile = function(objArray, frame, size, width, height) {    //функция отрисовки снарядов
        let objImg = new Image(); objImg.src = frame; //создаем новый имг и привязываем ему ссылку на спрайт
        for (i in objArray){    //цикл на отрисовку всех обьектов
            bufferCtx.drawImage(objImg, objArray[i].x + size / 2 - width / 2, objArray[i].y, width, height);
        };  //вставка всех картинок из спрайта в буферный канвас
    };
    this.drawExplosion = function(explosionArray, animObj, animPlay, frame, pFrame, plSize, objSize) {     //функция отрисовки взрыва
        let explImg = new Image(); explImg.src = frame,    //создаем новый имг и привязываем ему ссылку на спрайт взрыва
            animRate = animObj; //ссылка на скорость анимации взрыва
        for(i in explosionArray){   //цикл на отображение всех взрывов
            if(explosionArray[i].player){   //если "плейер" то отображаем его взрыв
                explImg = new Image(); explImg.src = pFrame;    //создаем новый имг и привязываем ему ссылку на спрайт взрыва
                let animRate = animPlay; //ссылка на скорость анимации взрыва игрока
                bufferCtx.drawImage(explImg, Math.round(explosionArray[i].animX)*215, Math.round(explosionArray[i].animY)*209,  215, 215, explosionArray[i].explX - plSize, explosionArray[i].explY - plSize, plSize * 2.5, plSize * 2.5);
                shake(6);   
            } else{ //в противном случае обычный взрыв
                bufferCtx.drawImage(explImg, Math.round(explosionArray[i].animX)*192, Math.round(explosionArray[i].animY)*192,  192, 192, explosionArray[i].explX, explosionArray[i].explY, objSize, objSize);
            };
        };  //удаляем когда доигрывает анимация
    };
    this.drawEnemy = function(objArray, frame, size){
        let objImg = new Image(); objImg.src = frame;
        for(i in objArray){
            bufferCtx.drawImage(objImg, objArray[i].x, objArray[i].y, size, size);
        };
    };
    this.drawEnemyProjectile = function(objArray, frame, size, width, height){
        let objImg = new Image(); objImg.src = frame; //создаем новый имг и привязываем ему ссылку на спрайт
        for (i in objArray){    //цикл на отрисовку всех обьектов
            bufferCtx.drawImage(objImg, objArray[i].x + size / 2 - width / 2, objArray[i].y, width, height);
        };  //вставка всех картинок из спрайта в буферный канвас
    };
    this.updateMenu = function(status){  //обработка кликов в меню
        const menuContent = document.getElementById("main-menu");
        let content = menuLinks[window.location.hash.slice(1)];
        (status) ? (menuContent.innerHTML = content, menuContent.style.display = 'block') : menuContent.style.display = 'none';    //если 
    };
    this.playSound = function(snd, vol){   //функция воспроизведения звуков
        let srcAudio = new Audio(snd); // создаем новый аудио
        srcAudio.autoplay = true; //запускаем
        srcAudio.volume = vol; //устанавливаем громкость
    };
    this.showScore = function(name, score){ //отображаем итог
        if(window.location.hash == '#score') {
            element.querySelector('#name').innerHTML = name;
            element.querySelector('#score').innerHTML = score;
        };
    };
};  //конец View
function Model () { //начало Models
    let view = null,    //ссылка на view
        element = null, //ссылка на контейнер
        model = this,   //ссылка на контекст
        pass;   //"пароль" в базе
        const ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php",    //ссылка на обработчик ajax запросов
        stringName='AstronoidHighScore';    //имя строки в базе
    //настройки
    const settings = {      //обьект с основными настройками
        canvas : null,  //ссылка на канвас
        ctx : null,     //контекст канваса
        bufferCanvas : null,    //ссылка на буферный канвас
        bufferCtx : null,   //контекст буферного канваса    
        mouseDown : null
    };
    const backGroundSettings = {        //обьект с настройками бэкграунда
        objArray : [],  //массив с обьектами бэкграунда
        objSpawnTime : null,    //скорость спавна обьектов в бэкграунде
        objMaxCount : 128,     //макс число обьектов бэкграунда на канвасе
        objColorArray : ['#ffffff', '#ffcccc', '#ffebcc', '#ffffcc', '#ccffcc', '#ccefff', '#ccccff', '#ffccff'],     //массив с цветами обьектов
        bgColor : '#00001a'     //цвет фона канваса
    
    }; 
    const objSettings = {   //обьект с настройками обьектов
        objArray : [],  //массив с обьектами
        explosionArray : [],    //массив с отрисовой взрывов
        frame :  'assets/asteroids.png',    //спрайт обьектов
        explosionFrame : 'assets/explosion.png',    //ссылка на спрайт взрыва
        objSpawnTime : null,    //скорость спавна обьектов
        objMaxCount : 64,     //макс число обьектов на канвасе
        size : 64,   //размер спрайта
        explAnimX : 0,  //анимация взрыва по X
        explAnimY : 0,   //анимация взрыва по Y
        explAnimRate : 0.4 //скорость анимации взрыва
    };
    const playerSettings = {    //обьект с настройками игрока
        frame : 'assets/player-ship.png',   //спрайт игрока
        explosionFrame : 'assets/player-explosion.png', //ссылка на спрайт взрыва игрока
        size : 64, //размер фрейма игрока
        x : null,   //координата игрока по оси X
        y : null,   //координата игрока по оси Y
        speed : 1,   //скорость перемещения
        score : 0,   //очки
        life : 3,    //количество "жизней"
        explAnimRate : 0.2  //скорость анимации взрыва
    };
    const projectileSettings = {    //обьект с настройками снарядов
        frame : 'assets/bullet.png', //спрайт снаряда
        objArray : [],   //массив с данными снарядов
        height : 16, //высота снаряда
        width : 8, //ширина снаряда
        speed : 6,   //скорость снаряда
        damage : 1, //"урон" от соприкосновения
        spawnTime : null //скорострельность
    };
    const audio = { //звуки
        volume : 0.4,   //громкость
        playerExpl : 'assets/snd/player-expl.mp3',  //взрыв игрока
        objExpl : 'assets/snd/hit-expl.mp3',    //взрыв бьекта
        shot : 'assets/snd/shot.mp3',    //звук выстрела
        background : 'assets/snd/theme.ogg'
    };
    const enemySetings = {  //обьект с настройками врагов
        objArray : [],  //массив с обьектами
        projectileArray : [], //массив с снарядами
        frame :  'assets/enemy.png',    //спрайт обьектов
        projFrame : 'assets/enemy-projectile.png', //спрайт снаряда
        shotSound : 'assets/snd/enemy-shot.mp3',    //звук выстрела
        objSpawnTime : null,    //скорость спавна обьектов
        width : 34, //высота снаряда
        height : 60,    //ширина снаряда
        speedX : 5, //скорость по X
        speedY : 0.5,   //скорость по Y
        size : 128,   //размер спрайта
        hitPoints : 6   //здоровье
    };
    //приватные методы
    function setMenu(){     //функция на создание меню
        let menu = document.createElement('div');   //создаем вместидище вёрстки меню
                menu.setAttribute('id', 'main-menu')     //добавляем атрибут айди
            element.append(menu);
    };
    function createBgObj() { //функция создания обьектов бэкграунда из конструктора
        let objArray = backGroundSettings.objArray; //ссылка на массив с обьектами в настройках
        (objArray.length === backGroundSettings.objMaxCount) ? clearInterval(backGroundSettings.objSpawnTime) : objArray.push(new BGObject);
    };       //если обьекты достигли макс количества, сбрасываем таймер
    function bgObjUpdate () {     //функция обновления координат обьектов
        let objArray = backGroundSettings.objArray, //ссылка на массив с обьектами в настройках
            height = settings.canvas.height,  //ссылка на значение высоты канваса
            width = settings.canvas.width;    //ссылка на значение ширины канваса
        
        for (i in objArray){  //цикл на условия всех обьектов бэкграунда
            (objArray[i].x > width) ? objArray[i].x = 0 : //если вышли правее X возвращаем в 0
            (objArray[i].y > height) ? objArray[i].y = -10:   //если ниже Y, то возвращаем за пределы канваса
            objArray[i].y += objArray[i].speed, objArray[i].x += objArray[i].shift;
        };   //меняем координаты, прибавляя скорость, добавляем отклонение по X
    };
    function createObj () {     //функция создания обьектов
        let objArray = objSettings.objArray; //ссылка на массив с обьектами в настройках
        //(objArray.length === objSettings.objMaxCount) ? clearInterval(objSettings.objSpawnTime) : objArray.push(new Object);
        objArray.push(new Object);
    };        //если обьекты достигли макс количества, сбрасываем таймер
    function objUpdate () {     //функция обновления коорднат обьектов
        let objArray = objSettings.objArray, //ссылка на массив с обьектами в настройках
            projectileArray = projectileSettings.objArray, //ссылка на массив с снарядами
            explosionArray = objSettings.explosionArray,    //ссылка на массив с взрывами
            size = objSettings.size,     //ссылка на размер обьекта
            height = settings.canvas.height,  //ссылка на значение высоты канваса
            width = settings.canvas.width;    //ссылка на значение ширины канваса
        
        for (i in objArray){  //цикл на условия всех обьектов
            (objArray[i].x > width + size) ? objArray[i].x = -size : //если вышле правее X возвращаем за пределы  левее Y
            (objArray[i].y > height) ? (objArray[i].y = -size, objArray[i].x = Math.round(Math.random() * settings.bufferCanvas.width)) :   //если ниже Y, то возвращаем за пределы канваса
            objArray[i].y += objArray[i].speed, objArray[i].x += objArray[i].shift; //меняеем координаты при любом другом условии
            //анимация
            (objArray[i].animFrame >= 7) ? (objArray[i].frameType +=1, objArray[i].animFrame = 0) : (objArray[i].frameType > 3) ? objArray[i].frameType = 0 : objArray[i].animFrame += objArray[i].spin;
            for (j in projectileArray){    //цикл на удаление обьектов при столкновении
                if ( Math.abs(objArray[i].x - projectileArray[j].x) < size / 2 && Math.abs(objArray[i].y - projectileArray[j].y)< size / 3){
                    objArray[i].hitPoints -= projectileSettings.damage; //отнимаем "урон"
                    projectileArray.splice(j,1);    //удаляем снаряд
                    break;      //прерываем цикл
                };
            };
            if(objArray[i].hitPoints <= 0){ //при хп меньши или равном нулю удаяем обьект
                explosionArray.push({explX : objArray[i].x, explY : objArray[i].y, animX : objSettings.explAnimX, animY : objSettings.explAnimY, player : false});  //пушим взрыв в массив
                playerSettings.score += 100;    //+очки по уничтожению
                objArray.splice(i,1);   //удаляем обьект
                playSound(audio.objExpl, audio.volume);  //воспроизводим звук
                break;  //прерываем цикл
                };
            };   //меняем координаты, прибавляя скорость, добавляем отклонение по X 
    };
    function updatePlayer () {  //функция обновления координат игрока
        let objArray = objSettings.objArray,    //ссылка на массив с обьектами
            enemyArray = enemySetings.objArray, //ссылка на массив с врагами
            enemyProjectileArray = enemySetings.projectileArray,    //ссылка на массив с снарядами врагов
            height = settings.canvas.height,  //ссылка на значение высоты канваса
            width = settings.canvas.width;    //ссылка на значение ширины канваса

        (playerSettings.x <= 0) ? playerSettings.x = 0 : //не даем выйти за пределы левее X
        (playerSettings.x >= width - playerSettings.size) ? playerSettings.x = width - playerSettings.size :    //не даем выйти за пределы правее X
        (playerSettings.y <= 0) ? playerSettings.y = 0 :    //не даем выйти за пределы выше Y
        (playerSettings.y + playerSettings.size >= height) ? playerSettings.y = height - playerSettings.size :  //не даем выйти за пределы ниже Y
        playerSettings.x, playerSettings.y;     //else ничего не меняем

        for(i in objArray){ //цикл на проверку столкновения с игроком
            if(Math.abs(playerSettings.x - objArray[i].x) < playerSettings.size && Math.abs(playerSettings.y - objArray[i].y)< playerSettings.size){
                playerSettings.life -= 1;   //снижаем жизнь
                objSettings.explosionArray.push({explX : playerSettings.x, explY : playerSettings.y, animX : objSettings.explAnimX, animY : objSettings.explAnimY, player : true});  //пушим взрыв в массив
                objArray.splice(i,1);   //убираем из массива
                (playerSettings.life < 1)  ?  window.location.hash = '#over' : reset();
                playSound(audio.playerExpl, audio.volume);    //воспроизводим звук взрыва
                break; //прерываем т.к. у нас один обьект и далее перебор не нужен
            };
        };
        for(j in enemyArray){
            if(Math.abs(playerSettings.x - enemyArray[j].x) < playerSettings.size *1.8 && Math.abs(playerSettings.y - enemyArray[j].y)< playerSettings.size * 1.8){
                playerSettings.life -= 1;   //снижаем жизнь
                objSettings.explosionArray.push({explX : playerSettings.x, explY : playerSettings.y, animX : objSettings.explAnimX, animY : objSettings.explAnimY, player : true});  //пушим взрыв в массив
                enemyArray.splice(i,1);   //убираем из массива
                (playerSettings.life < 1)  ?  window.location.hash = '#over' : reset();
                playSound(audio.playerExpl, audio.volume);    //воспроизводим звук взрыва
                break; //прерываем т.к. у нас один обьект и далее перебор не нужен
            };
        for(k in enemyProjectileArray){
            if(Math.abs(enemyProjectileArray[k].x - playerSettings.x) < enemySetings.width && Math.abs(enemyProjectileArray[k].y - playerSettings.y)< enemySetings.height){
                playerSettings.life -= 1;   //снижаем жизнь
                objSettings.explosionArray.push({explX : playerSettings.x, explY : playerSettings.y, animX : objSettings.explAnimX, animY : objSettings.explAnimY, player : true});  //пушим взрыв в массив
                enemyProjectileArray.splice(k,1);   //убираем из массива
                (playerSettings.life < 1)  ?  window.location.hash = '#over' : reset();
                playSound(audio.playerExpl, audio.volume);    //воспроизводим звук взрыва
                break; //прерываем т.к. у нас один обьект и далее перебор не нужен
            };
        };
    };
    };
    function createEnemy () {
        let objArray = enemySetings.objArray; //ссылка на массив с обьектами в настройках
        objArray.push(new Enemy);
    };
    function updateEnemy (){
        let objArray = enemySetings.objArray, //ссылка на массив с обьектами в настройках
            height = settings.canvas.height,  //ссылка на значение высоты канваса
            width = settings.canvas.width,    //ссылка на значение ширины канваса
            projectileArray = projectileSettings.objArray,  //ссылка на массив с снарядами
            explosionArray = objSettings.explosionArray;    //массив с взрывами
    
        for (i in objArray){    //обьект вражин (движение противника)        
            (objArray[i].x > width - enemySetings.size) ? objArray[i].xSpeed = -objArray[i].xSpeed : //если жоходит до правого края, начинаем толкать к левому
            (objArray[i].x <= 0) ? objArray[i].xSpeed = -objArray[i].xSpeed : //если дохоит до левого, толкаем в право
            (objArray[i].y >= height) ? objArray[i].y = -enemySetings.size : //если доходит до низа, отрисовываем сверху
            objArray[i].y += objArray[i].ySpeed * Math.random(), objArray[i].x += objArray[i].xSpeed * Math.random();   //меняем координаты
        
        for (j in projectileArray){    //цикл на удаление обьектов при столкновении(снаряд игрока в противника)
            if ( Math.abs(objArray[i].x - projectileArray[j].x) < enemySetings.size / 2 && Math.abs(objArray[i].y - projectileArray[j].y)< enemySetings.size / 2){
                objArray[i].hitPoints -= projectileSettings.damage; //отнимаем "урон"
                projectileArray.splice(j,1);    //удаляем снаряд
                break;      //прерываем цикл
            };
        };
        if(objArray[i].hitPoints <= 0){ //при хп меньши или равном нулю удаяем обьект(уничтожение противника)
            explosionArray.push({explX : objArray[i].x + enemySetings.size / 2, explY : objArray[i].y + enemySetings.size / 2, animX : objSettings.explAnimX, animY : objSettings.explAnimY, player : false});  //пушим взрыв в массив
            playerSettings.score += 300;    //+очки по уничтожению
            clearInterval(objArray[i].shoot);   //сбрасываем таймер
            objArray.splice(i,1);   //удаляем обьект
            playSound(audio.objExpl, audio.volume);  //воспроизводим звук
            break;  //прерываем цикл
            };
        };
    };  
    function playSound(snd, vol){   //функция воспроезвидения звука
        view.playSound(snd, vol);
    };
    function setBgMusic(){
        view.backgroundMusic = new Audio(audio.background);
        view.backgroundMusic.volume = audio.volume;
    };
    function reset(){   //сброс таймеров и обнуление массивов 
        objSettings.objArray = [];   //обнуляем массив(доработать)
        enemySetings.objArray.forEach(i => clearInterval(i.shoot)); //сбрасываем все таймеры стрельбы
        enemySetings.objArray = []; //обнуляем массив
        enemySetings.projectileArray = [];  //обнуляем массив
        clearInterval(objSettings.objSpawnTime);    //обнуляем счётчик спавна обьектов
        clearInterval(projectileSettings.spawnTime);    //обнуляем счётчик спавна снарядов
        clearInterval(enemySetings.objSpawnTime);    //сброс таймера на вражин
        setTimeout(()=> objSettings.objSpawnTime = setInterval(createObj, 500), 3000);  //ставим его на место с задержкой
        setTimeout(()=> projectileSettings.spawnTime = setInterval(createProjectile, 200), 3000);  //ставим его на место с задержкой
        setTimeout(()=> enemySetings.objSpawnTime = setInterval(createEnemy, 8000), 3000);
        settings.mouseDown = false; //выключаем стрельбу даже при зажатой кнопке
    };
    function reload(){  //перезапуск
        enemySetings.objArray.forEach(i => clearInterval(i.shoot));
        clearInterval(backGroundSettings.objSpawnTime), clearInterval(objSettings.objSpawnTime);
        clearInterval(projectileSettings.spawnTime), clearInterval(enemySetings.objSpawnTime);
        playerSettings.life = 3, playerSettings.score = 0;
        objSettings.objArray = [], enemySetings.objArray = [], enemySetings.projectileArray = [],
        objSettings.explosionArray = [], projectileSettings.objArray = [];
    };
        //AJAX
    function storeInfo() {  //AJAX чтение с планированным изменением
        pass = Math.random();   //генерируем пароль
        $.ajax({    //обьект запроса
                url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'LOCKGET', n : stringName, p : pass },
                success : lockGetReady, error : errorHandler
            });
    };
    function lockGetReady(callresult) { // AJAX перезапись
        if (callresult.error != undefined) alert(callresult.error);
        else {
            let info = {    //генерируем передаваемый обьект
                name : new Date().toDateString(),   //добавляем текущую дату
                score : playerSettings.score  //ссылка на значение
            };
            $.ajax({    //генерируем обьект запроса для перезаписи
                    url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                    data : { f : 'UPDATE', n : stringName, v : JSON.stringify(info), p : pass},
                    success : updateReady, error : errorHandler
            });
        };
    };
    function updateReady(callresult) {  //AJAX готовность
        if (callresult.error != undefined) alert(callresult.error);
    };
    function errorHandler(jqXHR,statusStr,errorStr) {   //AJAX обработчик ошибок
        alert(statusStr+' '+errorStr);
    };
    function showScore(callresult) {    //AJAX вернувшиеся данные
        if (callresult.error != undefined) alert(callresult.error);
        else if ( callresult.result!="" ) {
            let info = JSON.parse(callresult.result);
            view.showScore(info.name, info.score)  //передаем их дальше во View
        };
    };
    //функции снарядов
    function createProjectile () {  //функция создания снарядов
        let objArray = projectileSettings.objArray; //ссылка на массив с снарядами
        if(settings.mouseDown) objArray.push({x : playerSettings.x, y : playerSettings.y}), playSound(audio.shot, audio.volume); //пушим данные снарядов
    };
    function createEnemyProjectile (cx, cy) { //функция на снаряды врагов
        let projectileArray = enemySetings.projectileArray; //ссылка на массив с снарядами
        projectileArray.push({x : cx + enemySetings.size / 2, y : cy + enemySetings.size / 2}); //пушим данные снарядов
        playSound(enemySetings.shotSound, audio.volume);
    };
    function updateProjectile () {  //функция обновления координат снарядов
        let objArray = projectileSettings.objArray; //ссылка на массив с данными снарядов   
        let enemyArray = enemySetings.projectileArray;  //ссылка на массив с снарядами        
        for (i in objArray){    //цикл для всех снарядов игрока
            (objArray[i].y <= 0) ? objArray.splice(i,1) : objArray[i].y -= projectileSettings.speed; 
        };      //удаляем обьект если он вышел за пределы канваса
        for (j in enemyArray){  //цикл для всех снарядов врагов
            (enemyArray[j].y >= settings.canvas.height) ? enemyArray.splice(j,1) : enemyArray[j].y += projectileSettings.speed; 
        };
    };
    function updateExplosion(){ //функция обновления анимации взрыва
        let explosionArray = objSettings.explosionArray,    //ссылка на массив с взрывами
            animRate = objSettings.explAnimRate; //ссылка на скорость анимации взрыва
    for(i in explosionArray){   //цикл на отображение всех взрывов
        if(explosionArray[i].player){   //если "плейер" то отображаем его взрыв
            let animRate = playerSettings.explAnimRate; //ссылка на скорость анимации взрыва игрока
            (explosionArray[i].animX > 4)  ? (explosionArray[i].animY += 1, explosionArray[i].animX = 0) : (explosionArray[i].animY > 3) ? (explosionArray[i].animX = 0, explosionArray[i].animY = 0, explosionArray.splice(i,1)) : explosionArray[i].animX += animRate;
        } else{ //в противном случае обычный взрыв
            (explosionArray[i].animX >= 4) ? (explosionArray[i].animY +=1, explosionArray[i].animX = 0) : (explosionArray[i].animY > 4) ? explosionArray.splice(i,1) : explosionArray[i].animX += animRate;
        };
    };  //удаляем когда доигрывает анимация
    };
    //конструкторы
    function BGObject () {  //конструктор обьектов бг
        this.x = Math.round(Math.random() * settings.bufferCanvas.width);    //рендомное смещение по X
        this.y = -10;  //y всегда выше(за пределами) канваса
        this.speed = Math.round(Math.random() * 0.5) + 1; //скорость обьектов
        this.radius = Math.round(Math.random() * 1) + 1; //радиус обьекта
        this.color = backGroundSettings.objColorArray[(Math.round(Math.random() * (backGroundSettings.objColorArray.length - 1)))]; //цвет обьекта, случайны из настроек
        this.shift = Math.round(Math.random())*0.2;   //отклонение по X
    };
    function Object () {   //конструктор обьектов
        this.x = Math.round(Math.random() * settings.bufferCanvas.width);    //рендомное смещение по X
        this.y = -objSettings.size;  //y всегда выше(за пределами) канваса(по размеру фрейма спрайта)
        this.speed = Math.round(Math.random() * 1) + 1; //скорость обьектов
        this.shift = Math.round(Math.random())*0.2;   //отклонение по X
        this.spin = Math.round(Math.random()* .1) + .25;    //скорость анимации (поворота обьекта)
        this.size = objSettings.size; //задаем размер спрайта 
        this.frameType = 0; //вид спрайта из спрайтлиста
        this.animFrame = 0; //начало анимации с первого фрейма
        this.hitPoints = Math.round(Math.random() * 2) + 1;  //"прочность" обьекта
    };
    function Enemy (){  //конструктор врагов
        this.x = Math.round(Math.random() * settings.bufferCanvas.width);
        this.y = -enemySetings.size;
        this.xSpeed = enemySetings.speedX;
        this.ySpeed = enemySetings.speedY;
        this.hitPoints = enemySetings.hitPoints;
        this.shoot = setInterval(()=>createEnemyProjectile(this.x, this.y), 2000);
    };
    //управление
    this.mouseMove = function(x,y){     //перемещение
        playerSettings.x = x - playerSettings.size /2;
        playerSettings.y = y - playerSettings.size /2;
    };
    this.mouseClick = function(status){ //стрельба
        (status) ? settings.mouseDown = true : settings.mouseDown = false;
    };
    this.updateMenu = function(hash){   //функция кликов в меню
        (hash == '#play') ? (view.updateMenu(false), view.backgroundMusic.play()) : view.updateMenu(true);  //данные об отображении окна меню
        if (hash != '#play' && view.backgroundMusic){
            view.backgroundMusic.pause();
             view.backgroundMusic.currentTime = 0;
        };
    };
    //инит методы
    this.init = function (vie, el){ //функция инициализации
        view = vie, element = el; //привязка 
    };
    this.setCanvas = function(element){    //функция инициализации канваса
        let canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'canvas');      //создаем родитель-вместилище
            canvas.setAttribute('width', window.innerWidth); // document.body.clientWidth
            canvas.setAttribute('height', window.innerHeight); // document.body.clientHeight,
        element.append(canvas);
    
        settings.canvas = document.getElementById('canvas');    //ссылка на основной канвас
        settings.bufferCanvas = document.createElement('canvas');   //ссылка на буфферный канвас
        settings.ctx = settings.canvas.getContext('2d');    //контекст основного канвас
        settings.bufferCtx = settings.bufferCanvas.getContext('2d');    //контекст буфферного канвас
        
        settings.bufferCtx.canvas.width = settings.ctx.canvas.width;    //ширина буфера == ширине основного
        settings.bufferCtx.canvas.height = settings.ctx.canvas.height;  //высота буфера == высоте основного
        setMenu();  //добавляем див с меню
        view.setCanvas(settings.canvas, settings.bufferCanvas, settings.ctx, settings.bufferCtx); //отправляем ссылки на канвасы в вью
        //когда готов канвас ставим начальные координаты игрока
        playerSettings.x = settings.ctx.canvas.width / 2, playerSettings.y = settings.ctx.canvas.height / 2;
    };
    this.startAnimation = function(){   //функция отрисовки всего
        
        bgObjUpdate();  //обновляем данные обо всем
        objUpdate();
        updatePlayer();
        updateProjectile();
        updateExplosion();
        updateEnemy();

        view.drawBackGround(backGroundSettings.bgColor);    //отрисовываем всё в буфере
        view.drawBgObj(backGroundSettings.objArray)
        view.drawObj(objSettings.objArray, objSettings.frame, objSettings.size);
        if(objSettings.objArray.length){    //косметический эффект
            view.drawPlayer(playerSettings.x, playerSettings.y, playerSettings.size, playerSettings.frame);   //отрисовка игрока в буфере
            view.drawProjectile(projectileSettings.objArray, projectileSettings.frame, playerSettings.size, projectileSettings.width, projectileSettings.height);  //отрисовка снарядов в буфере
        };  //только при наличии обьектов
        view.drawExplosion(objSettings.explosionArray, objSettings.explAnimRate, playerSettings.explAnimRate, objSettings.explosionFrame, playerSettings.explosionFrame, playerSettings.size, objSettings.size);
        view.drawEnemyProjectile(enemySetings.projectileArray, enemySetings.projFrame, playerSettings.size, enemySetings.width, enemySetings.height);
        view.drawEnemy(enemySetings.objArray, enemySetings.frame, enemySetings.size);
        view.drawHud(playerSettings.score, playerSettings.life);

        view.extractFromBuffer();   //вставляем из буфера в основной канвас

        let animation = requestAnimationFrame(model.startAnimation);    //ссылка на таймер
        if(playerSettings.life < 1){    //если "жизни" заканчиваются
            cancelAnimationFrame(animation);    //останавливаем анимацию
            storeInfo();    //сохраняем данные
            reload();
        };
    };  
    this.setTimers = function(){    //функия установки таймеров
        reload();
        setBgMusic();
        backGroundSettings.objSpawnTime = setInterval(createBgObj, 100);    //на спавн обьектов бг
        objSettings.objSpawnTime = setInterval(createObj, 500);  //на спавн обьектов
        projectileSettings.spawnTime = setInterval(createProjectile, 200); //на спавн снарядов
        enemySetings.objSpawnTime = setInterval(createEnemy, 8000); //спавн вражин
    };
    this.changeVolume = function(vol){  //функция на установку звука из меню
        audio.volume = vol;
    };
    this.restoreInfo = function() {//AJAX прочитать данные
        $.ajax({    //для чтения
                url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'READ', n : stringName },
                success : showScore, error : errorHandler
            });
    };
};  //конец Model
function Controller () {    //начало Controller
    let model = null,   //ссылка на модель
        element = null; //ссылка на контейнер
    this.init = function(mod,el){   //функция инициализации
        model = mod, element = el; //привязка 
        model.setCanvas(element);  //запуск инициализации канвас
        setListeners(); //добавляем листенеры
    };
    //приватные методы
    function setListeners(){
        let canvas = element.querySelector('#canvas'); //ссылка на канвас
        canvas.addEventListener('mousemove', function mouseMove(event){
            let x = event.clientX - event.target.getBoundingClientRect().left;
            let y = event.clientY- event.target.getBoundingClientRect().top;
            model.mouseMove(x, y);
        }); //ивент на движение
        canvas.addEventListener('mouseup', function mouseUp(){
            model.mouseClick(false);
        });     //ивент на нажатие   кнопки "огонь"
        canvas.addEventListener('mousedown', function mouseDown(){
            model.mouseClick(true);
        }); //ивент на отпускание кнопки "огонь"
        window.addEventListener("hashchange", updateMenu); //ивент на меню
        window.addEventListener("load", function() {    //ивент на раздел #main по умолчанию, при открытии
            window.location.hash = "#main", updateMenu(); 
          });
        element.addEventListener("input", function change (){   //листенер на ползунок в меню с звуком
            let el = element.querySelector('input');
            model.changeVolume(el.value);
        });
    };
    function updateMenu(){  //обработка кликов в меню
        (window.location.hash == '#play') ? (   //при нажатии плей
            model.setTimers(),  //ставим таймеры
            model.startAnimation(), //запускаем отрисовку
            model.updateMenu(window.location.hash)) : //передаем дальше инф о нажатой кнопке
            model.updateMenu(window.location.hash); //передаем дальше инф о нажатой кнопке
            if(window.location.hash == '#exit') window.close();
            if(window.location.hash == '#score') model.restoreInfo();    //обновляем данные о результате
    };
};  //конец Controller



