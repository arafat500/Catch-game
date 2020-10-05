    const canvas = document.createElement('canvas');
    const tile = 25;
    const enemies = {
      speed: 1
      , arr: []
      , total: 20
    };
    const game = {
      play: false
      , req: ''
    };
    canvas.setAttribute('height', tile * 20);
    canvas.setAttribute('width', tile * 25);
    canvas.style.backgroundColor = 'black';
    const ctx = canvas.getContext('2d');
    const btnPos = {
      x: 10
      , y: canvas.height / 2 - 100
      , width: canvas.width - 20
      , height: 100
    };
    const btn = document.createElement('button');
    btn.textContent = "start game";
    document.body.prepend(btn);
    btn.addEventListener('click', () => {
      btn.style.display = 'none';
      gameStart();
    });
    canvas.addEventListener('click', (e) => {
      if (!game.play) {
        const rect = canvas.getBoundingClientRect();
        console.log(rect);
        const mouseObj = {
          x: e.clientX - rect.left
          , y: e.clientY - rect.top
          , width: 5
          , height: 5
        }
        if (col(btnPos, mouseObj)) {
          gameStart();
        }
      }
    })
     
    function startScreen() {
      let output = `Click to Start the Game`;
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.fillRect(btnPos.x, btnPos.y, btnPos.width, btnPos.height);
      ctx.font = '24px arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.fillText(output, canvas.width / 2, btnPos.y + 40);
    }
    document.body.prepend(canvas);
    const player = {
      x: canvas.width / 2
      , y: canvas.height - (tile * 3)
      , speed: 5
      , width: tile * 4
      , height: tile * 1
      , color: 'red'
      , score: 0
      , lives: 0
    };
    const keyz = {
      ArrowLeft: false
      , ArrowRight: false
      , ArrowUp: false
      , ArrowDown: false
    };
    document.addEventListener('keydown', (e) => {
      if (e.code in keyz) {
        keyz[e.code] = true;
      }
    })
    document.addEventListener('keyup', (e) => {
      if (e.code in keyz) {
        keyz[e.code] = false;
      }
    })
    startScreen();
     
    function col(a, b) {
      let boo = a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
      if (boo) {
        console.log('HIT');
      }
      return boo;
    }
     
    function enemyMaker() {
      let xPos = Math.random() * (canvas.width - tile);
      let badValue = Math.random() < 0.2;
      let colorBack = badValue ? 'red' : '#' + Math.random().toString(16).substr(-6);
      let wid = Math.random() * 20 + 10;
      enemies.arr.push({
        x: xPos
        , y: Math.random() * -1000
        , width: wid * 2
        , height: wid * 2
        , size: wid
        , speed: Math.random() * 2 + 3
        , color: colorBack
        , bad: badValue
        , toggle: true
        , growth: 0
      })
    }
     
    function gameOver() {
      cancelAnimationFrame(game.req);
      game.play = false;
      btn.style.display = 'block';
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let output = `GAME OVER Your Score is ${player.score}`;
      ctx.beginPath();
      ctx.fillStyle = '#222';
      ctx.fillRect(10, 10, canvas.width - 20, 50);
      ctx.font = '24px arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.fillText(output, canvas.width / 2, 40);
      startScreen();
    }
     
    function gameStart() {
      game.req = requestAnimationFrame(draw);
      game.play = true;
      enemies.arr = [];
      player.score = 0;
      player.lives = 3;
      player.x = canvas.width / 2;
      player.y = canvas.height - (tile * 3);
    }
     
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (enemies.arr.length < enemies.total) {
        //console.log(enemies);
        enemyMaker();
      }
      if (keyz.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
      }
      if (keyz.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
      }
      if (keyz.ArrowUp && player.y > canvas.height - tile * 8) {
        player.y -= player.speed;
      }
      if (keyz.ArrowDown && player.y < canvas.height - tile) {
        player.y += player.speed;
      }
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      enemies.arr.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
          enemies.arr.splice(index, 1);
        }
        ctx.beginPath();
        ctx.fillStyle = enemy.color;
        if (enemy.toggle && enemy.bad) {
          enemy.growth++;
          enemy.size += 1;
          if (enemy.growth > 10) {
            enemy.toggle = false;
            enemy.growth = 0;
          }
        }
        else if (enemy.bad) {
          ctx.fillStyle = '#000000';
          enemy.growth++;
          if (enemy.growth > 10) {
            enemy.toggle = true;
            enemy.growth = 0;
          }
          enemy.size -= 1;
        }
        if (game.play) {
          ctx.strokeStyle = 'white';
          ctx.arc(enemy.x + (enemy.width / 2), enemy.y + (enemy.height / 2), enemy.size, 0, Math.PI * 2);
          //ctx.strokeRect(enemy.x,enemy.y,enemy.width,enemy.height);
          ctx.stroke();
          ctx.fill();
        }
        if (col(player, enemy)) {
          let removed = enemies.arr.splice(index, 1)[0];
          if (removed.bad) {
            player.lives--;
            if (player.lives < 0) {
              gameOver();
              player.lives = '-';
            }
          }
          else {
            player.score += Math.ceil(removed.size);
          }
          console.log(removed);
        }
      })
      if (game.play) {
        let output = `Live(s) : ${player.lives} Score : ${player.score}  `;
        ctx.beginPath();
        ctx.fillStyle = '#222';
        ctx.fillRect(10, 10, canvas.width - 20, 50);
        ctx.font = '24px arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(output, canvas.width / 2, 40);
        //ctx.fillRect(enemy.x,enemy.y,enemy.size,enemy.size);
        game.req = requestAnimationFrame(draw);
      }
    }