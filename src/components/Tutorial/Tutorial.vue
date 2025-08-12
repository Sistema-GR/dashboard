<template>
  <button
	@click="startTutorial"
	class="fixed bottom-4 right-4 bg-azure-800 text-white p-3 rounded-full shadow-lg hover:bg-azure-900 transition-colors z-50"
	title="Iniciar Tutorial"
  >
	<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
	  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
	</svg>
  </button>
</template>

<script setup>
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';


const driverObj = driver({
	showProgress: true,
	showButtons: ['next', 'previous', 'close'],
	nextBtnText: 'Próximo',
	prevBtnText: 'Anterior', 
	doneBtnText: 'Fim',
	closeBtnText: 'Voltar',
	progressText: 'Previewing {{current}}/{{total}}',
	popoverClass: 'userguiding-theme',
	overlayColor: 'rgba(0, 0, 0, 0.5)',
	allowClose: false,
	steps: [
		// Step 1/17 - Boas vindas
		{
			popover: {
				title: '👋 Bem-vindo ao painel de gratificação',
				description: 'Estamos felizes por você estar aqui! Este tutorial rápido vai te ajudar a entender todas as informações importantes sobre sua gratificação.<br><br><strong>Verifique se seus dados estão corretos.</strong>',
				position: 'center'
			}
		},
		// Step 2/17 - Nome do servidor
		{
			element: '#tutorial-server-name',
			popover: {
				title: 'Nome do servidor',
				description: 'Este é o nome registrado no sistema para a gratificação.',
				position: 'bottom'
			}
		},
		// Step 3/17 - Valor
		{
			element: '#tutorial-value',
			popover: {
				title: 'Seu Valor de Gratificação',
				description: 'Aqui você visualiza o valor bruto da sua gratificação. Lembre-se que este valor não inclui os descontos de impostos.',
				position: 'bottom'
			}
		},
		// Step 4/17 - Aviso
		{
			element: '#tutorial-warning',
			popover: {
				title: 'Os valores mostrados são brutos, sem os descontos de impostos que podem ser aplicados.',
				description: '',
				position: 'top'
			}
		},
		// Step 5/17 - Clique aqui para ver mais
		{
			element: '#tutorial-details',
			popover: {
				title: 'Clique aqui para ver mais...',
				description: '',
				position: 'top'
			}
		},
		// Step 6/17 - Matrículas ativas
		{
			element: '#tutorial-matricula-0',
			popover: {
				title: 'Visualize neste campo cada uma das suas matrículas que estão atualmente ativas no sistema.',
				description: '',
				position: 'top'
			}
		},
		// Step 7/17 - Dados da matrícula
		{
			element: '#painel-infos',
			popover: {
				title: 'Aqui estão os seus dados da sua matrícula',
				description: '',
				position: 'top'
			}
		},
		// Step 8/17 - Certifique dados
		{
			element: '#tutorial-table-dados',
			popover: {
				title: 'Nesse quadro mostra seus dados. Certifique que todos estão corretos!',
				description: '',
				position: 'top'
			}
		},
		// Step 9/17 - Valor total da rede
		{
			element: '#tutorial-valor-rede',
			popover: {
				title: 'Aqui mostra o valor total da sua rede.',
				description: '',
				position: 'top'
			}
		},
		// Step 10/17 - Valor máximo por unidade  
		{
			element: '#tutorial-valor-unidade',
			popover: {
				title: 'Aqui mostra o valor máximo recebido por unidade.',
				description: '',
				position: 'top'
			}
		},
		// Step 11/17 - Desconto
		{
			element: '#tutorial-desconto',
			popover: {
				title: 'Nesse campo mostra o desconto.',
				description: '',
				position: 'top'
			}
		},
		// Step 12/17 - Valor total que irá receber
		{
			element: '#tutorial-valor-total',
			popover: {
				title: 'É aqui, mostra o valor total que você ira receber.',
				description: '',
				position: 'top'
			}
		},
		// Step 13/17 - Critérios  
		{
			element: '#tutorial-criteria',
			popover: {
				title: 'Esta tabela mostra os 4 critérios principais: frequência (mín. 96%), tempo de atuação (mín. 6 meses), Formação e Atividades. Cada um, mostra se você está "Apto" ou "Não Apto".',
				description: '',
				position: 'top'
			}
		},
		// Step 14/17 - Alocações
		{
			element: '#tutorial-allocations',
			popover: {
				title: 'Aqui você vê onde trabalhou durante o período, incluindo: unidade escolar, período (início/fim), função exercida, carga horária e grupo de gratificação.',
				description: '',
				position: 'top'
			}
		},
		// Step 15/17 - Frequência/Afastamentos
		{
			element: '#tutorial-frequency',
			popover: {
				title: 'Esta seção mostra todos os seus afastamentos registrados: licenças, faltas justificadas, etc. Mostra as datas, tipo de afastamento e se foram contabilizados para o cálculo.',
				description: '',
				position: 'top'
			}
		},
		// Step 16/17 - Recurso
		{
			element: '#tutorial-resource',
			popover: {
				title: 'Se você acha que alguma informação está incorreta ou quer contestar algum critério, clique em "Recurso". Você pode anexar documentos para comprovar seu ponto de vista.',
				description: '',
				position: 'left'
			}
		},
		// Step 17/17 - Conclusão
		{
			popover: {
				title: 'Você concluiu o tutorial!',
				description: 'Agora você está pronto para navegar pelo painel de gratificação e acompanhar as informações com facilidade.',
				position: 'center'
			}
		}
	]
});

const startTutorial = () => {
	driverObj.drive();
};
</script>

<style scoped>
/* Botão já estilizado, tema do popover é global */
</style>
