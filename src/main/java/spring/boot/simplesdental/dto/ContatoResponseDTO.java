package spring.boot.simplesdental.dto;

import java.time.LocalDate;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ContatoResponseDTO {
    private Long id;
    private String nome;
    private String contato;
    private LocalDate created_date;
    private Long profissionalId;
}
