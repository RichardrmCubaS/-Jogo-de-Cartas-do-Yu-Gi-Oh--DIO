/* Yu-Gi-Oh Game.*/
/* Declaração de Constantes
Estado */
const state = {
    score: {
      playerScore: 0,
      computerScore: 0,
      scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
      avatar: document.getElementById("card-image"),
      name: document.getElementById("card-name"),
      type: document.getElementById("card-type"),
    },
    fieldCards: {
      player: document.getElementById("player-field-card"),
      computer: document.getElementById("computer-field-card"),
    },
    playersSides: {
      player1: "player-cards",
      player1BOX: document.querySelector("#player-cards"),
      computer: "computer-cards",
      computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
      button: document.getElementById("next-duel"),
    },
  };
  
  const playersSides = {
    player1: "player-cards",
    computer: "computer-cards",
  };
   
  const pathImages = "./src/assets/icons/";
  
 /* Declaraç]ao dos dados das Cartas */
  const cardData = [
    {
      id: 0,
      name: "Blue Eyes White Dragon",
      type: "Paper",
      img: `${pathImages}dragon.png`,
      winOf: [1],
      loseOf: [2],
    },
    {
      id: 1,
      name: "Dark Magician",
      type: "Rock",
      img: `${pathImages}magician.png`,
      winOf: [2],
      loseOf: [0],
    },
    {
      id: 2,
      name: "Exodia",
      type: "Scissor",
      img: `${pathImages}exodia.png`,
      winOf: [0],
      loseOf: [1],
    },
  ];

 /*Funções */
 /* Obter um ID aleatório */
  async function getRandomId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
  }
  
  /* Criar a imagem de uma carta */
  async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");
    
    if (fieldSide === playersSides.player1) {
    
      cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
      });
    
      cardImage.addEventListener("mouseover", () => {
        drawSelectCard(idCard);
      });
       
    }
  
    return cardImage;
  }
  
  /* Definir cartas no campo */
  async function setCardsField(cardId) {
    await removeAllCardsImages();  
    let computerCardId = await getRandomId();  
    await hiddenCardsFieldsImages(true);  
    await hiddenCardsdetails();  
    await drawCardsInField(cardId, computerCardId);  
    let duelResults = await checkDuelResult(cardId, computerCardId);  
    await updateScore();  
    await drawButton(duelResults);

  }
  
  /* Desenhar cartas no campo */
  async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
  }
  
  /* Ocultar imagens dos campos de cartas */
  async function hiddenCardsFieldsImages(value) {
    if (value === true) {
      state.fieldCards.player.style.display = "block";
      state.fieldCards.computer.style.display = "block";
    }
  
    if (value === false) {
      state.fieldCards.player.style.display = "none";
      state.fieldCards.computer.style.display = "none";
    }
  }
  
  /* Ocultar detalhes das cartas */
  async function hiddenCardsdetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = " Select ";
    state.cardSprites.type.innerText = "Your Card ";
  }
  
  /*  Atualizar a pontuação */
  async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} Lose: ${state.score.computerScore}`;
  }
  
  // Função para desenhar o botão
  async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
  }
  
  /* Verificar o resultado do duelo */
  async function checkDuelResult(playerCardId, computerCardId) {
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];
  
    if (playerCard.winOf.includes(computerCardId)) {
      duelResults = "Win";
      state.score.playerScore++;
    }
  
    if (playerCard.loseOf.includes(computerCardId)) {
      duelResults = "Lose";
      state.score.computerScore++;
    }
    await playAudio(duelResults);
  
    return duelResults;
  }
  
  /* Remover todas as imagens de cartas*/
  async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playersSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
  
    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
  }
  
  /* selecionar a carta desenhar */
    async function drawSelectCard(index) {    
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Type : " + cardData[index].type;
  }
  
  /* Desenhar cartas no campo */
  async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
      const randomIdCard = await getRandomId();
      const cardImage = await createCardImage(randomIdCard, fieldSide);  
      document.getElementById(fieldSide).appendChild(cardImage);
    }
  }
  
  /* Redefinir o duelo */
  async function resetDuel() {
    // Reinicia os elementos visuais para um novo duelo
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";  
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
  
    // Inicializa um novo duelo
    init();
  }
  
  /* Função para reproduzir áudio com tratamento de erro*/
  async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
  
    try {
      audio.play();
    } catch (error) {
      console.error("Erro ao reproduzir áudio:", error.message);
    }
  }
  
 /* Função Principal do jogo */
  function init() {
    // Configuração inicial para um novo duelo
    hiddenCardsFieldsImages(false);
  
    drawCards(5, playersSides.player1);
    drawCards(5, playersSides.computer);
  
    const bgm = document.getElementById("bgm");
    bgm.play();
  }
  
  /* inicio do Jogo */
  init();
  