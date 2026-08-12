package spring.boot.simplesdental.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ContatoDTO {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;
    private String contato;
    private LocalDate created_date;
    private Long profissionalId;
}
