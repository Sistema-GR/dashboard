<template>
  <!-- Botão fixo para iniciar tutorial -->
  <button
    @click="startTutorial"
    class="fixed bottom-16 right-6 bg-azure-800 text-white p-3 rounded-full shadow-md hover:bg-azure-900 transition-colors z-50 sm:bottom-20 sm:right-8 md:p-4"
    title="Iniciar Tutorial"
  >
    <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </button>
 
  <!-- Botões dinâmicos animados -->
  <transition-group
    name="fade-slide"
    tag="div"
    class="fixed bottom-20 right-4 sm:bottom-28 sm:right-8 md:bottom-32 md:right-12 flex flex-col gap-2 z-50"
  >
    <button
      v-for="(btn) in dynamicButtons"
      :key="btn.label"
      @click="btn.action"
      class="tutorial-nav-btn px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
    >
      {{ btn.label }}
    </button>
  </transition-group>
  <!-- Canvas fixo para confetti -->
  <canvas ref="confettiCanvas" 
          class="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
          :style="{ width: '100%', height: '100%' }"></canvas>
</template>

<script setup>
// Função para abrir accordions durante o tutorial
const openAccordion = (selector) => {
  const accordion = document.querySelector(selector);
  if (accordion && typeof accordion.click === 'function') {
    accordion.click();
  } else if (accordion) {
    accordion.setAttribute('open', 'true');
    accordion.dispatchEvent(new Event('change'));
  }
};
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import confetti from "canvas-confetti";
import { ref, onMounted } from "vue";

const dynamicButtons = ref([]);
const confettiCanvas = ref(null);
let confettiInstance = null;



const startConfettiBurst = () => {
  if (!confettiInstance) {
    confettiInstance = confetti.create(confettiCanvas.value, {
      resize: true,
      useWorker: true,
      disableForReducedMotion: true
    });
  }

  const count = 1000;
  const defaults = {
    origin: { y: 0.9 },
    spread: 90,
    ticks: 120,
    zIndex: 9999,
    resize: true
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      scalar: window.innerWidth < 768 ? 0.8 : 1
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
};

const driverObj = driver({
  popoverClass: 'custom-tooltip',
  showProgress: true,
  showButtons: ["next", "previous", "close"],
  nextBtnText: "Próximo",
  prevBtnText: "Anterior",
  doneBtnText: "Fim",
  closeBtnText: "Voltar",
  progressText: "Passo {{current}}/{{total}}",
  overlayColor: "rgba(0, 0, 0, 0.6)",
  allowClose: false,
  onDestroyed: () => {
    dynamicButtons.value = [];
    startConfettiBurst();
  },
  steps: [
    // Step 1
    {
      popover: {
        title: '<div class="titulo-img"><img src="/src/assets/images/inicioTutorial.png" class="responsive-img" />Bem-vindo ao formulário de recurso</div>',
        description: '<div class="descricao">Este tutorial te guiará através do Formulário de Recurso. <br><br><strong>Para que serve esta tela?</strong> <br><br> Esta tela permite que você conteste formalmente informações relacionadas à sua gratificação por resultados quando: <br>❌ Há dados incorretos em seu cadastro. <br>❌ Discorda dos critérios aplicados. <br>❌Possui documentos que comprovam situação diferente.</div>',
        position: "center",
      },
      onNext: () => {
        dynamicButtons.value = [
          { label: "Botão Extra", action: () => alert("Extra acionado!") },
          { label: "Pular Tutorial", action: () => driverObj.moveNext(16) }
        ];
      },
    },
    // Step 2
    {
      element: "#tutorial-detalhes",
      popover: {
        description: '<div class="descricao-2">DICA: Antes de preencher o recurso, clique em "Clique aqui e veja o detalhamento" para: <br><br> ✅ Ver seus critérios de avaliação. <br>✅ Entender por que não recebeu. <br>✅ Verificar se realmente precisa contestar.</div>',
        position: "bottom",
      },
    },
    // Step 3
    {
      element: "#tutorial-formulario",
      popover: {
        description: '<div class="descricao">No preenchimento do formulário, os dados pessoais são inseridos automaticamente.<br> Esses campos aparecem em cinza e não podem ser editados. <br><br> <strong>Certifique que seus dados estão corretos!</strong></div>',
        position: "bottom",
      },
    },
    // Step 4
    {
      element: "#tutorial-unidade",
      popover: {
        title: '',
        description: '<div class="descricao">Digite o nome completo da sua unidade. <br><br> Exemplo: "EMEI Profª Maria Silva" ou "Escola Municipal João Santos". <br><br> Campo obrigatório - aparecerá erro se não preenchido.</div>',
        position: "top",
      },
    },
    // Step 5
    {
      element: "#tutorial-descricao",
      popover: {
        title: '<div class="titulo-img-2">Descrição do recurso (obrigatório).<br></div>',
        description: '<div class="descricao-2"><strong>Como escrever uma boa descrição:</strong> <br><br> ✅ Faça: <br> • Seja específico ao explicar o problema. <br> • Informe datas e períodos relevantes. <br> • Cite documentos que possui. <br> • Utilize linguagem formal e respeitosa. <br><br> ❌ Não faça: <br> • Usar palavras ofensivas ou desrespeitosas. <br> • Fornecer informações vagas ou incompletas. <br> • Deixar de mencionar documentos importantes.</div>',
        position: "top",
      },
    },
    // Step 6
    {
      element: "#tutorial-documentos",
      popover: {
        title: '<div class="titulo-img-2">Upload de Documentos</div>',
        description: '<div class="descricao-2"><strong>Como anexar documentos(passo a passo):</strong> <br> 1. Clique na área pontilhada ou no texto "Escolher Arquivo". <br> 2. Selecione os arquivos no seu computador. <br> • <strong>Formatos aceitos:</strong> PDF, JPG e PNG <br> • <strong>Multiplos arquivos:</strong> É possível anexar mais de um arquivo de uma vez. <br> • Os arquivos selecionados aparecerão listados logo abaixo. <br> • Para remover um arquivo, clique no ❌ ao lado do nome. <br><br> <strong>Analise bem o documento antes de encaminhar!</strong></div>',
        position: "top",
      },
    },
    // Step 7 - Final
    {
      popover: {
        title: '<div class="titulo-img"><img src="/src/assets/images/TutorialConcluido.png" class="responsive-img" />Você concluiu o tutorial!</div>',
        description: '<div class="descricao">Antes de enviar, verifique se a unidade de atuação está preenchida, a descrição está clara e detalhada, há pelo menos um documento anexado, os termos foram aceitos e os arquivos estão corretos e legíveis. Clique em <strong>Enviar</strong> e aguarde a validação do sistema. Caso haja erros, eles aparecerão em vermelho para correção. <br><br> O sistema aceita arquivos PDF, JPG e PNG, com tamanho dentro do limite permitido. <strong>Evite documentos ilegíveis, linguagem inadequada, informações desatualizadas ou recursos duplicados.</strong> <br><br> Após o envio, você será redirecionado para a página de status, onde poderá acompanhar o andamento e prazos.</div>',
        position: "center",
      }
    },
  ],
});

const startTutorial = () => {
  driverObj.drive();
};

onMounted(() => {
  confettiInstance = confetti.create(confettiCanvas.value, {
    resize: true,
    useWorker: true,
    disableForReducedMotion: true
  });
  window.dispatchEvent(new Event('resize'));
});

defineExpose({
  startTutorial
});
</script>

<style>

.driver-popover-descrition {
  font-size: 15px !important;
  line-height: 1.5 !important;
  color: #f0f9ff !important;
}

/* Força os estilos dos botões do driver.js popover */
.driver-popover-next-btn {
  background: linear-gradient(135deg, #152656 0%, #5cabfe 100%) !important;
  color: #fff !important;
  border-radius: 12px !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  min-width: 120px !important;
  min-height: 48px !important;
  text-align: center !important;
  padding: 12px 32px !important;
  text-shadow: none !important;
  border: none !important;
  margin-left: 5px !important;
}
.driver-popover-next-btn:hover {
  background: #3b6cae !important; 
  color: #fff !important;
}
.driver-popover-prev-btn {
  background:  linear-gradient(135deg, #222b44c2 0%, #92b5e7b0 100%) !important;
  color: #fff !important;
  border-radius: 12px !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  min-width: 120px !important;
  min-height: 48px !important;
  text-align: center !important;
  padding: 12px 32px !important;
  text-shadow: none !important;
  border: none !important;
  margin-right: 5px !important;
}

.driver-popover-prev-btn:hover {
  background: linear-gradient(135deg, #152656 0%, #5cabfe 100%) !important;
  color: #fff !important;
}

/* Tooltip customizado */
.custom-tooltip {
  background: white!important;
  color: #000000 !important;
  border-radius: 10px !important;
  padding: 30px !important;
  border: none !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
  max-width: 500px !important;
  width: 90vw !important;
}


.custom-tooltip h3 {
  font-size: 20px !important;
  font-weight: 700 !important;
  margin-bottom: 12px !important;
  color: white !important;
}

.titulo-img {
  display: grid;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 20px;
  text-align: center;
  color: black;
  justify-items: center;
}

.descricao {
  font-size: 15px !important;
  color: black;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

.custom-tooltip p {
  font-size: 15px !important;
  margin-top: 12px !important;
  line-height: 1.5 !important;
  color: #e0f2fe !important;
}

.custom-tooltip .driver-popover-footer {
  margin-top: 16px !important;
}


.custom-tooltip .driver-popover-close-btn {
  background-color: #ef4444 !important;
  color: white !important;
}

.custom-tooltip .driver-popover-close-btn:hover {
  background-color: #dc2626 !important;
}

.custom-tooltip .driver-popover-progress-text {
  color: #93c5fd !important;
  font-weight: 500 !important;
}

/* Responsividade para imagens */
.responsive-img {
  max-width: 380px;
  width: 100%;
  height: auto;
}

/* Tooltip customizado com melhor responsividade */
.custom-tooltip {
  background: white!important;
  color: #000000 !important;
  border-radius: 10px !important;
  padding: 30px !important;
  border: none !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
  max-width: 500px !important;
  width: 90vw !important;
}

/* Responsividade para título */
.titulo-img {
  display: grid;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 20px;
  text-align: center;
  color: black;
  justify-items: center;
}

/* Responsividade para descrição */
.descricao {
  font-size: 15px !important;
  color: black;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  line-height: 1.6 !important;
}

/* Responsividade para botões do driver */
.driver-popover-next-btn {
  background: linear-gradient(135deg, #152656 0%, #5cabfe 100%) !important;
  color: #fff !important;
  border-radius: 12px !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  min-width: 120px !important;
  min-height: 48px !important;
  padding: 12px 32px !important;
  text-shadow: none !important;
  border: none !important;
  margin-left: 5px !important;
}

.driver-popover-prev-btn {
  background: linear-gradient(135deg, #222b44c2 0%, #92b5e7b0 100%) !important;
  color: #fff !important;
  border-radius: 12px !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  min-width: 120px !important;
  min-height: 48px !important;
  padding: 12px 32px !important;
  text-shadow: none !important;
  border: none !important;
  margin-right: 5px !important;
}

/* Media queries para responsividade */
@media (max-width: 640px) {
  .custom-tooltip {
    max-width: 95vw !important;
    padding: 20px !important;
    font-size: 0.95rem !important;
  }
  
  .titulo-img {
    font-size: 18px !important;
    gap: 15px !important;
  }
  
  .responsive-img {
    max-width: 280px !important;
  }
  
  .descricao {
    font-size: 14px !important;
    padding-top: 15px !important;
    padding-bottom: 15px !important;
  }
  
  .driver-popover-next-btn,
  .driver-popover-prev-btn {
    min-width: 100px !important;
    min-height: 42px !important;
    padding: 10px 20px !important;
    font-size: 14px !important;
  }
}

@media (max-width: 480px) {
  .custom-tooltip {
    padding: 15px !important;
  }
  
  .titulo-img {
    font-size: 16px !important;
    gap: 10px !important;
  }
  
  .responsive-img {
    max-width: 240px !important;
  }
  
  .descricao {
    font-size: 13px !important;
  }
  
  .driver-popover-next-btn,
  .driver-popover-prev-btn {
    min-width: 80px !important;
    min-height: 38px !important;
    padding: 8px 16px !important;
    font-size: 13px !important;
  }
}

/* Highlight do elemento */
.driver-highlighted-element {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
  border-radius: 8px !important;
  transition: box-shadow 0.3s !important;
}

canvas {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}
</style>