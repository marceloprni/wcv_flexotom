const mestButton = document.addEventListener('DOMContentLoaded', function() {
    // Função para obter o número de dias no mês
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    // Função para criar botões dos dias
    function createDaysButtons(year, month) {

        const daysContainer = document.getElementById('daysContainer');
        daysContainer.innerHTML = ''; // Limpa o contêiner antes de adicionar os botões

        const daysInMonth = getDaysInMonth(year, month);

        for (let day = 1; day <= daysInMonth; day++) {
            const button = document.createElement('button');
            button.textContent = day;
            button.id = `day-${day}`; 
            button.addEventListener('click', function() {
                const idSelecionado = this.id
                console.log(idSelecionado)
            })
            daysContainer.appendChild(button);
        }

        
    }

    // Exemplo: criando botões para junho de 2024
    const year = new Date().getFullYear();
    const month = new Date().getMonth(); // Junho (Janeiro é 0, Fevereiro é 1, etc.)
    const day = new Date().getDate();
    const mesArray = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    document.getElementById("mesString").innerText = mesArray[month]
    createDaysButtons(year, month);
    $(`#day-${day}`).css({"background":"#dc2626", "border": "1px solid white", "color": "white"})
});

export {
    mestButton
}