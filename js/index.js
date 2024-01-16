document.addEventListener("DOMContentLoaded", () => {
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
    let cloudsStopped = false;
    let isSsj = false;
    let isReturningToNormal = false;
    let isJumping = false;
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
    const theme = new Audio('audio/theme-music.mp3');

    // Ajuste os volumes aqui
    death.volume = 0.7; // 70% do volume
    jumping.volume = 0.7;
    transforming.volume = 1.0; // Volume total (não alterado)
    flying.volume = 0.5; // 60% do volume
    detransform.volume = 0.9; 
    theme.volume = 1.0; // 50% do volume


    const jump = () => {
        if (!(isJumping || isSsj || isReturningToNormal)) {
            
            keyboardSpace.src = "img/keyboard-space-pressed.png";
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

    const transformToSsj = () => {
        if (!isJumping) {

            keyboardEnter.src = "img/keyboard-enter-pressed.png";

            transforming.play();

            isSsj = true;
            mario.src = "img/mario-transformation.gif"; // Imagem de transformação
            mario.style.bottom = "135px";
            mario.style.width = "320px";
            mario.style.animation = "transformation 2s ease-out";
    
            // Após 3 segundos, mude para a forma SSJ
            setTimeout(() => {
                keyboardEnter.src = "img/keyboard-enter.png";

                flying.play();

                mario.src = "img/mario-ssj.gif";
                mario.style.bottom = "180px";
                mario.style.width = "260px";
    
                // Ajuste a velocidade das nuvens ao entrar no modo SSJ
                cloudsSpeed = initialCloudsSpeed * 5;
    
                // Ajuste a velocidade do cano ao entrar no modo SSJ
                pipeSpeed = initialPipeSpeed * 5;
            }, 3000);
    
            // Impede a destransformação durante 3 segundos
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
        }
    }    


    const increaseSpeedThreshold = 30;
    let speedIncreaseCounter = 0;



    const increaseScore = () => {
        score++;
        scoreDisplay.innerText = `Score: ${score}`;

        // Verifica se atingiu o limite para aumentar a velocidade
        if (score % increaseSpeedThreshold === 0) {
            speedIncreaseCounter++;
            // Ajusta a velocidade do cano e das nuvens
            pipe.style.animationDuration =  initialPipeSpeed + speedIncreaseCounter * 0.1;
            clouds.style.animationDuration =  initialPipeSpeed + speedIncreaseCounter * 0.1;
            //pipeSpeed = initialPipeSpeed + speedIncreaseCounter * 0.1;
            //cloudsSpeed = initialCloudsSpeed + speedIncreaseCounter * 0.1;
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
        
    
        // Ajusta a velocidade do cano com base no tempo decorrido
        pipe.style.animationDuration = `${1.5 / pipeSpeed}s`;
    
        // Ajusta a velocidade das nuvens com base no tempo decorrido
        clouds.style.animationDuration = `${20 / cloudsSpeed}s`;
    
        // Ajusta a posição das nuvens com base na velocidade (acelera ou desacelera)
        cloudsPosition -= cloudsSpeed;
        clouds.style.left = `${cloudsPosition}px`;
    
    }, 10);
    
    
    
    document.addEventListener("keydown", (event) => {
        if (event.code === "Space" || event.key === " ") {
            jump();
        } else if (event.code === "Enter" && !isJumping) {
            if (!isSsj && !isReturningToNormal) {
                transformToSsj();
            } else if (isSsj && !isReturningToNormal) {
                transformToNormal();
            }
        }
    });    
});
