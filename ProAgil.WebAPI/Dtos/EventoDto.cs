using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Local { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string DataEvento { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Tema { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [Range(5, 1000, ErrorMessage = "A quantidade de pessoas deve ser entre 5 e 1.000")]
        public int QtdPessoas { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string ImagemURL { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }
        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}