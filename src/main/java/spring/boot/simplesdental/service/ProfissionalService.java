package spring.boot.simplesdental.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import spring.boot.simplesdental.dto.ContatoResponseDTO;
import spring.boot.simplesdental.dto.ProfissionalDTO;
import spring.boot.simplesdental.dto.ProfissionalResponseDTO;
import spring.boot.simplesdental.mapper.ProfissionalMapper;
import spring.boot.simplesdental.model.Contato;
import spring.boot.simplesdental.model.Profissional;
import spring.boot.simplesdental.repository.ProfissionalRepository;

@Service
public class ProfissionalService {

    @Autowired
    private ProfissionalRepository profissionalRepository;

    public Profissional salvarProfissional(ProfissionalDTO dto) {
       Profissional profissional = new Profissional();
       profissional.setNome(dto.getNome());
       profissional.setCargo(dto.getCargo());
       profissional.setNascimento(dto.getNascimento());

       if(dto.getCreated_date() != null){
        profissional.setCreated_date(dto.getCreated_date());
     }
     
       if (dto.getContatos() != null && dto.getContatos().size() > 0) {
            List<Contato> contatos = dto.getContatos().stream().map(c -> {
                Contato contato = new Contato();
                contato.setNome(c.getNome());
                contato.setContato(c.getContato());
                contato.setCreated_date(c.getCreated_date());
                contato.setProfissional(profissional);
                return contato;
            }).collect(Collectors.toList());
            profissional.setContatos(contatos);
       }       
       return profissionalRepository.save(profissional);

    }

    public List<ProfissionalResponseDTO> listarTodos(String q) {
        List<Profissional> profissionais;

        if (q != null && !q.isBlank()) {
            profissionais = profissionalRepository.findByNomeContainingIgnoreCaseOrCargoContainingIgnoreCase(q, q);
        } else {
            profissionais = profissionalRepository.findAll();
        }

        return profissionais.stream().map(ProfissionalMapper::toDTO).collect(Collectors.toList());
    }

    public List<Map<String, Object>> listarComCamposSelecionados(String q, List<String> fields) {
        List<Profissional> profissionais;

        if (q != null && !q.isBlank()) {
            profissionais = profissionalRepository.findByNomeContainingIgnoreCaseOrCargoContainingIgnoreCase(q, q);
        } else {
            profissionais = profissionalRepository.findAll();
        }

        return profissionais.stream().map(profissional -> {
            Map<String, Object> map = new HashMap<>();
            if (fields.contains("id")) map.put("id", profissional.getId());
            if (fields.contains("nome")) map.put("nome", profissional.getNome());
            if (fields.contains("cargo")) map.put("cargo", profissional.getCargo());
            if (fields.contains("nascimento")) map.put("nascimento", profissional.getNascimento());
            if (fields.contains("created_date")) map.put("created_date", profissional.getCreated_date());
            return map;
        }).collect(Collectors.toList());
    }

    public Optional<Profissional> buscarPorId(Long id) {
        return profissionalRepository.findById(id);
    }
    
    public Profissional atualizarProfissional(Long id, ProfissionalDTO dto) {
        Profissional profissional = profissionalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

        profissional.setNome(dto.getNome());
        profissional.setCargo(dto.getCargo());
        profissional.setNascimento(dto.getNascimento());

        if (dto.getCreated_date() != null) {
            profissional.setCreated_date(dto.getCreated_date());
        }

        return profissionalRepository.save(profissional);
    }
    
    public void deletarProfissional(Long id) {
        if (!profissionalRepository.existsById(id)) {
            throw new RuntimeException("Profissional não encontrado");
        }
        profissionalRepository.deleteById(id);
    }
    
    public List<ContatoResponseDTO> listarContatosPorCliente(Long profissionalId) {
        Profissional profissional = profissionalRepository.findById(profissionalId)
            .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

            return profissional.getContatos().stream().map(c -> {
                ContatoResponseDTO dto = new ContatoResponseDTO();
                dto.setId(c.getId());
                dto.setNome(c.getNome());
                dto.setContato(c.getContato());
                dto.setCreated_date(c.getCreated_date());
                dto.setProfissionalId(profissionalId);
                return dto;
            }).collect(Collectors.toList());
    }
}
