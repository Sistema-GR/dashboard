<template>
    <Whiteboard title="" :isSidebarMinimized="isSidebarMinimized" class="-translate-y-12">
        <div class="flex items-center justify-center w-full px-6 py-24 sm:py-32 lg:px-8 lg:py-12">
          <div class="w-full px-10 divide-y divide-gray-900/10">
            <h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-900 whitespace-nowrap">
              Perguntas Frequentes
            </h2>
            <dl class="mt-10 space-y-6 divide-y divide-gray-900/10">
              <Disclosure as="div" class="pt-6" v-for="faq in faqs" :key="faq.question">
                <template v-slot="{ open }">
                  <dt>
                    <DisclosureButton as="button" class="flex w-full items-start justify-between text-left text-gray-900">
                      <span class="text-base font-semibold leading-7">{{ faq.question }}</span>
                      <span class="ml-6 flex h-7 items-center">
                        <PlusSmallIcon v-if="!open" class="h-6 w-6" aria-hidden="true" />
                        <MinusSmallIcon v-else class="h-6 w-6" aria-hidden="true" />
                      </span>
                    </DisclosureButton>
                  </dt>
                  <DisclosurePanel as="dd" class="mt-2 pr-12">
                    <p class="text-base leading-7 text-gray-600">{{ faq.answer }}</p>
                  </DisclosurePanel>
                </template>
              </Disclosure>
            </dl>
          </div>
        </div>
    </Whiteboard>
  </template>
  
  <script>
  import { inject } from 'vue';
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
  import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/vue/24/outline';
  import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
  
  export default {
    name: "FaqValorizacaoEducacao",
    components: { Whiteboard, Disclosure, DisclosureButton, DisclosurePanel, MinusSmallIcon, PlusSmallIcon },
    data() {
      return {
        faqs: [
          {
            question: "Qual é o objetivo da gratificação por resultado educacional?",
            answer: "O objetivo é incentivar o desempenho dos profissionais de educação, promovendo melhorias na qualidade do ensino na Rede Municipal de Ensino de Joinville."
          },
          {
            question: "Quem pode receber a gratificação por resultado educacional?",
            answer: "A gratificação pode ser recebida por professores, profissionais da gestão escolar e equipes administrativas, desde que atendam aos critérios de desempenho estabelecidos."
          },
          {
            question: "Como são calculados os valores das gratificações?",
            answer: "Os valores variam conforme o cargo e os resultados alcançados. Por exemplo, profissionais em sala de aula podem receber até R$ 8.000,00, enquanto os da equipe administrativa podem receber até R$ 4.000,00."
          },
          {
            question: "Quais indicadores são usados para calcular a gratificação?",
            answer: "Os resultados de aprendizagem nas escolas, conforme o Índice de Desenvolvimento da Educação Municipal (IDEM), são considerados. Eles incluem o fluxo escolar e a proficiência dos alunos em avaliações externas."
          },
          {
            question: "Como funciona a gratificação para servidores em mais de uma escola?",
            answer: "A gratificação é proporcional à carga horária em cada escola. Por exemplo, se você trabalha em duas escolas com 20 horas em cada, a gratificação será dividida proporcionalmente entre elas."
          },
          {
            question: "Profissionais dos Centros de Educação Infantil (CEIs) podem receber a gratificação?",
            answer: "Sim, os profissionais dos CEIs recebem a gratificação com base no desempenho da escola mais próxima e que normalmente recebe seus alunos no Ensino Fundamental."
          }
        ]
      }
    },
    setup() {
      const isSidebarMinimized = inject('isSidebarMinimized');
      return { isSidebarMinimized };
    }
  }
  </script>
  