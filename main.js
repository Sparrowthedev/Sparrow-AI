// import "boxicons";
const chatArea = document.getElementById("chatArea");
const form = document.querySelector("form");
const textarea = document.querySelectorAll("textarea");
const humanRequest = document.querySelector(".humanRequest");
const botAnswer = document.querySelector(".botAnswer");
const botImageLoader = document.querySelector(".botImageLoader");
const humanImageRequest = document.querySelector(".humanImageRequest");
const botImageAnswer = document.querySelector(".botImageAnswer");
const selectedItems = document.querySelectorAll(".item");
const createImagePage = document.getElementById("createImage");
const createCompletionPage = document.getElementById("createCompletion");
const createImageText = document.querySelector("#createImage #textArea");
const modal = document.querySelector(".modal");
const downloadCon = document.querySelector('#downloadCon');
const downloadButton = document.getElementById('downloadButton');

const modalClose = document.querySelector(".modalClose").addEventListener("click", () => {
  modal.classList.remove("open");
});


let loadInterval;

function botLoader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === ".....") {
      element.textContent = "";
    }
  }, 300);
}

function botTyping(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

async function handleCreateCompletion(e) {
  e.preventDefault();
  textarea.forEach(textarea => {
    textarea.style.height = "48px"
  })

  const formData = new FormData(form);
  form.reset();
  if (!formData.get("prompt")) {
    modal.classList.add("open");
    return;
  }

  botLoader(botAnswer);
  document.querySelector("#copyIcon").style.color = "#6E7681";

  humanRequest.textContent = "";
  humanRequest.textContent = formData.get("prompt");

  chatArea.scrollTop = chatArea.scrollHeight;
  const response = await fetch("https://sparrow-ai.onrender.com/openai/chatGptClone", {
    method: "POST",
    body: JSON.stringify({
      prompt: formData.get("prompt"),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { data } = await response.json();
  const message = data.message.content;
  console.log(message);
  if (response.ok) {
    clearInterval(loadInterval);
    botTyping(botAnswer, message.trim());
  } else {
    clearInterval(loadInterval);
    botTyping(botAnswer, "Oops!! something went wrong. Please try again later");
  }
}


async function handleImageGeneration() {
  if (!createImageText.value) {
    modal.classList.add("open");
    return;
  }

  botImageAnswer.src = "";
  botLoader(botImageLoader);

  humanImageRequest.textContent = "";
  humanImageRequest.textContent = createImageText.value;

  console.log(createImageText.value);
  chatArea.scrollTop = chatArea.scrollHeight;
  const response = await fetch("https://sparrow-ai.onrender.com/openai/imageGeneration", {
    method: "POST",
    body: JSON.stringify({
      prompt: createImageText.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  createImageText.value = "";

  const { data } = await response.json();
  if (response.ok) {
    clearInterval(loadInterval);
    botImageAnswer.src = data;
    downloadCon.style.display = 'block'
    function downloadImage() {
      const link = document.createElement('a');
      link.href = data;
      link.download = 'image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    downloadButton.addEventListener('click', downloadImage);
  } else {
    clearInterval(loadInterval);
    botTyping(botImageLoader, "Oops!! something went wrong. Please try again later");
  }
}

document.querySelector(".createCompletionBtn").addEventListener("click", handleCreateCompletion);

document.querySelector(".handleImageGenerationBtn").addEventListener("click", (e) => {
  e.preventDefault();
  handleImageGeneration();
});

selectedItems.forEach((selectedItem, index) => {
  selectedItem.addEventListener("click", () => {
    selectedItems.forEach((unselectedBtn) => {
      unselectedBtn.classList.remove("activeItem");
    });
    selectedItems[index].classList.add("activeItem");

    if (selectedItem.innerText === "Generate Images") {
      createImagePage.style.display = "block";
      createCompletionPage.style.display = "none";
    }

    if (selectedItem.innerText === "Ask Me") {
      createImagePage.style.display = "none";
      createCompletionPage.style.display = "block";
    }
  });
});

document.querySelectorAll(".menuBar").forEach((toggler) => {
  toggler.addEventListener("click", () => {
    document.querySelector("nav").style.left = "0";
    document.querySelector(".navOverlay").style.display = "block";
  });
});

document.querySelector(".navClose").addEventListener("click", function () {
  document.querySelector("nav").style.left = "-200px";
  document.querySelector(".navOverlay").style.display = "none";
});

document.querySelector(".copyBtn").addEventListener("click", () => {
  navigator.clipboard.writeText(document.querySelector(".botAnswer").textContent);
  document.querySelector("#copyIcon").style.color = "#10A37F";
});

textarea.forEach(function(textarea) {
  textarea.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
});


