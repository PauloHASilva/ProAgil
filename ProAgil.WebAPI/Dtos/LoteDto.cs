using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class LoteDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [Range(1, 50000000, ErrorMessage = "O valor deve ser superior à R$ 1,00")]
        public decimal Preco { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string DataInicio { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string DataFim { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [Range(1, 50000000, ErrorMessage = "A quantidade deve ser superior a 1")]
        public int Quantidade { get; set; }

        public EventoDto Evento { get; }

    }
}