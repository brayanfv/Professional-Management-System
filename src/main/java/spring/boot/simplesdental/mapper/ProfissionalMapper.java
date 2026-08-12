package spring.boot.simplesdental.mapper;

import java.util.List;
import java.util.stream.Collectors;

import spring.boot.simplesdental.dto.ContatoResponseDTO;
import spring.boot.simplesdental.dto.ProfissionalResponseDTO;
import spring.boot.simplesdental.model.Profissional;

public class ProfissionalMapper {
    public static ProfissionalResponseDTO toDTO(Profissional profissional) {
        ProfissionalResponseDTO dto = new ProfissionalResponseDTO();
        dto.setId(profissional.getId());
        dto.setNome(profissional.getNome());
        dto.setCargo(profissional.getCargo());
        dto.setNascimento(profissional.getNascimento());
        dto.setCreated_date(profissional.getCreated_date());

        List<ContatoResponseDTO> contatos = profissional.getContatos().stream().map(c -> {
            ContatoResponseDTO contatoDTO = new ContatoResponseDTO();
            contatoDTO.setId(c.getId());
            contatoDTO.setNome(c.getNome());
            contatoDTO.setContato(c.getContato());
            contatoDTO.setCreated_date(c.getCreated_date());
            return contatoDTO;
        }).collect(Collectors.toList());

        dto.setContatos(contatos);
        return dto;
    }
}
