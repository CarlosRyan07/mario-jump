document.addEventListener("DOMContentLoaded", async () => {
    const mario = document.querySelector(".mario");
    const pipe = document.querySelector(".pipe");
    const clouds = document.querySelector(".clouds");
    const scoreDisplay = document.createElement("div");
    const timerDisplay = document.createElement("div");
    const keyboardSpace = document.querySelector(".keyboard-space");
    const keyboardEnter = document.querySelector(".keyboard-enter");
    
    scoreDisplay.classList.add("score");
    timerDisplay.classList.add("timer");
    document.body.appendChild(scoreDisplay);
    document.body.appendChild(timerDisplay);

    let score = 0;
    let speedIncreaseCounter = 0;
    let cloudsStopped = false;
    let isSsj = false;
    let hasShownThanksMessage = false;
    let isReturningToNormal = false;
    let isJumping = false;
    let isBowserEvent = false;
    let isGameEnded = false; // Adicione esta variável para controlar o estado do jogo
    let startTime = Date.now();
    let initialPipeSpeed = 1;
    let initialCloudsSpeed = 1;
    let pipeSpeed = initialPipeSpeed;
    let cloudsSpeed = initialCloudsSpeed;

    const death = new Audio('audio/death.mp3');
    const jumping = new Audio('audio/pulo.mp3');
    const transforming = new Audio('audio/transformando.mp3');
    const flying = new Audio('audio/som-voando.mp3');    
    const detransform = new Audio('audio/destransformando.mp3');
    const bowser = new Audio('audio/event-bowser-audio.mp3');
    const theme = new Audio('audio/theme-music.mp3');

    // Ajuste os volumes aqui
    death.volume = 0.7; // 70% do volume
    jumping.volume = 0.7;
    transforming.volume = 1.0; // Volume total (não alterado)
    flying.volume = 0.5; // 60% do volume
    detransform.volume = 0.9; 
    theme.volume = 1.0; // 50% do volume

    // Função para carregar os áudios de forma assíncrona
    const loadAudios = () => {
        return Promise.all([
            new Promise((resolve) => { death.addEventListener('canplaythrough', resolve); death.load(); }),
            new Promise((resolve) => { jumping.addEventListener('canplaythrough', resolve); jumping.load(); }),
            new Promise((resolve) => { transforming.addEventListener('canplaythrough', resolve); transforming.load(); }),
            new Promise((resolve) => { flying.addEventListener('canplaythrough', resolve); flying.load(); }),
            new Promise((resolve) => { detransform.addEventListener('canplaythrough', resolve); detransform.load(); }),
            new Promise((resolve) => { bowser.addEventListener('canplaythrough', resolve); bowser.load(); }),
            new Promise((resolve) => { theme.addEventListener('canplaythrough', resolve); theme.load(); })
        ]);
    };

    // Espera que todos os áudios sejam carregados antes de prosseguir
    await loadAudios();

    const showThanksMessage = () => {
        isGameOver = true;
        hasShownThanksMessage = true; 
        const thanksMessage = document.createElement("div");
        thanksMessage.classList.add("thanks-message");
        thanksMessage.innerText = "THANKS FOR PLAYING!";
        document.body.appendChild(thanksMessage);
    
        // Desativar eventos de teclado
        document.removeEventListener("keydown", jump);
        document.removeEventListener("keydown", transformToSsj);
        document.removeEventListener("keydown", eventBowser);
    
        // Adicionar evento de reinício
        document.addEventListener("keydown", restartGameAfterThanks);
    };
    const showRestartMessage = () => {
        const restartContainer = document.createElement("div");
        restartContainer.classList.add("restart-message-container");
    
        const restartMessage = document.createElement("div");
        restartMessage.classList.add("restart-message");
        restartMessage.innerText = "Press any button for restart";
    
        restartContainer.appendChild(restartMessage);
        document.body.appendChild(restartContainer);
    
        restartContainer.style.backgroundColor = "rgba(0, 0, 0, 1)";
    };
    
    
    
    const restartGameAfterThanks = (event) => {
        if (event.code === "keydown") {
            location.reload();
        }
    };

    const jump = () => {
        if (!(isJumping || isSsj || isReturningToNormal)) {
            keyboardSpace.src = "img/keyboard-space-pressed.png";
            
            // Verificar se o som anterior terminou completamente antes de reproduzir
            if (!jumping.paused) {
                jumping.currentTime = 0;
            }

            jumping.play();

            isJumping = true;
            mario.classList.add("jump");
            setTimeout(() => {
                mario.style.animation = "none";
                mario.offsetHeight;
                mario.classList.remove("jump");
                keyboardSpace.src = "img/keyboard-space.png";
                isJumping = false;
            }, 500);
            mario.style.animation = "jump 500ms ease-out";
            mario.style.transformOrigin = "bottom";
        }
    }

    let canDetransform = true;

    const marioFlying = () => {
            keyboardEnter.src = "img/keyboard-enter.png";
            flying.play();
            
            mario.src = "img/mario-ssj.gif";
            mario.style.bottom = "180px";
            mario.style.width = "260px";

            cloudsSpeed = initialCloudsSpeed * 5;
            pipeSpeed = initialPipeSpeed * 5;
        }
        
        const transformToSsj = () => {
            if (!isJumping && !isSsj) {
                keyboardEnter.src = "img/keyboard-enter-pressed.png";
                transforming.play();
        
                isSsj = true;
                mario.src = "img/mario-transformation.gif";
                mario.style.bottom = "135px";
                mario.style.width = "320px";
                mario.style.animation = "transformation 2s ease-out";
        
                setTimeout(() => {
                    if (isSsj) {
                        marioFlying();
                    }
                }, 3000);
        
                canDetransform = false;
                setTimeout(() => {
                    canDetransform = true;
                }, 3000);
            }
        }
        
        const transformToNormal = () => {
            if (isSsj && !isJumping && canDetransform) {
                keyboardEnter.src = "img/keyboard-enter-pressed.png";
                flying.pause();
                detransform.play();
        
                isReturningToNormal = true;
                isSsj = false;
        
                // Delay antes de mudar a imagem para evitar o piscar
                setTimeout(() => {
                    mario.src = "img/back-to-normal.gif";
                    mario.style.bottom = "135px";
                    mario.style.width = "300px";
                    mario.style.animation = "back-to-normal 3s ease-out";
        
                    cloudsSpeed = 0.2;
        
                    setTimeout(() => {
                        keyboardEnter.src = "img/keyboard-enter.png";
                        isReturningToNormal = false;
                        mario.style.bottom = "0";
                        mario.style.width = "150px";
                        mario.src = "img/mario.gif";
        
                        cloudsSpeed = initialCloudsSpeed;
                        pipeSpeed = initialPipeSpeed;
                    }, 3000);
                }, 100);
            }
        }        

    const eventBowser = () => {
        isGameEnded = true;
        mario.src = "img/event-bowser.gif";
        mario.style.bottom = "140px";
        mario.style.width = "1100px";   
        mario.style.animation = "bowser-animation 23s ease-out";
        
        theme.volume = 0.0;
        flying.pause();
        bowser.play();
        isBowserEvent = true;
        
        
        setTimeout(() => {
            isBowserEvent = false;
            theme.volume = 1.0;
            flying.play();
       
            mario.src = "img/mario-ssj.gif"; 
            mario.style.bottom = "180px";
            mario.style.width = "260px";
            mario.style.animation = "end-game 3.2s ease-out";
            cloudsSpeed = initialCloudsSpeed * 5;
            setTimeout(() => {
                mario.style.bottom = "180px";
                mario.style.left = "100%";
                flying.pause();
                theme.volume = 0.5
                showThanksMessage();
                document.addEventListener("keydown", restartGame)
                
                },3000);
                setTimeout(() => {
                    showRestartMessage();
                },6000);
            
        }, 23000);
       
    }

    const increaseScore = () => {
        if (!isGameEnded) { 
            score++;
            scoreDisplay.innerText = `Score: ${score}`;

            if (score === 300) {
                eventBowser(); // Inicia o evento do Bowser quando o score atingir 50
            }

            if (score % 30 === 0) {
                speedIncreaseCounter++;
                pipe.style.animationDuration = `${15 + pipeSpeed}s`;
                clouds.style.animationDuration = initialPipeSpeed + speedIncreaseCounter + "s";
            }
        }
    }

    const restartGame = () => {
        location.reload();
    }

    const loop = setInterval(() => {
        theme.play();

        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");
        const cloudsPosition = clouds.offsetLeft;

        if (isReturningToNormal) {
            pipe.style.animation = "none";
            pipe.style.right = "100%";
        }

        if (!isReturningToNormal) {
            pipe.style.animation = "pipe-animation 1.5s infinite linear";
        }

        if (isBowserEvent) {   

            theme.pause();
            flying.pause();
            bowser.play();
            pipe.style.animation = "none";
            pipe.style.right = "100%";
            cloudsSpeed = 0.15; 
            
        }

        if (pipePosition <= 124 && pipePosition > 0 && marioPosition < 100 && !cloudsStopped) {
            pipe.style.animation = "none";
            pipe.style.left = `${pipePosition}px`;

            clouds.style.animation = "none";
            clouds.style.left = `${cloudsPosition}px`;
            cloudsStopped = true;

            mario.style.animation = "none";
            mario.style.bottom = `${marioPosition}px`;

            mario.src = "img/game-over.png";
            mario.style.width = "75px";
            mario.style.marginLeft = "51px";

            theme.pause();
            death.play();

            clearInterval(loop);

            document.addEventListener("keydown", restartGame);
        }

        if (pipePosition <= 0 && !cloudsStopped && !isReturningToNormal) {
            increaseScore();
        }

        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

        timerDisplay.innerText = `Time: ${minutes}:${seconds}`;

        pipe.style.animationDuration = `${1.5 / pipeSpeed}s`;
        clouds.style.animationDuration = `${20 / cloudsSpeed}s`;

        clouds.style.left = `${cloudsPosition}px`;

    }, 10);

    document.addEventListener("keydown", (event) => {
        if (!isBowserEvent) {
            if (event.code === "Space" || event.key === " ") {
                jump();
            } else if (event.code === "Enter" && !isJumping) {
                if (!isSsj && !isReturningToNormal) {
                    transformToSsj();
                } else if (isSsj && !isReturningToNormal) {
                    transformToNormal();
                }
            } else if (!isBowserEvent && hasShownThanksMessage) {
                restartGame();
            }
        }
    });
         
});
