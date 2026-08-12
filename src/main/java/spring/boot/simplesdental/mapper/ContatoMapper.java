package spring.boot.simplesdental.mapper;

import spring.boot.simplesdental.dto.ContatoResponseDTO;
import spring.boot.simplesdental.model.Contato;

public class ContatoMapper {
    public static ContatoResponseDTO toDTO(Contato contato) {
        ContatoResponseDTO dto = new ContatoResponseDTO();
        dto.setId(contato.getId());
        dto.setNome(contato.getNome());
        dto.setContato(contato.getContato());
        dto.setCreated_date(contato.getCreated_date());
        dto.setProfissionalId(contato.getProfissional().getId());
        return dto;
    }
}

