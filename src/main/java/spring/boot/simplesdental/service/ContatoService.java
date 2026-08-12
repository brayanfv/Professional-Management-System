package spring.boot.simplesdental.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import spring.boot.simplesdental.dto.ContatoDTO;
import spring.boot.simplesdental.dto.ContatoResponseDTO;
import spring.boot.simplesdental.mapper.ContatoMapper;
import spring.boot.simplesdental.model.Contato;
import spring.boot.simplesdental.model.Profissional;
import spring.boot.simplesdental.repository.ContatoRepository;
import spring.boot.simplesdental.repository.ProfissionalRepository;

@Service
public class ContatoService {

    private final ContatoRepository contatoRepository;
    private final ProfissionalRepository profissionalRepository;

    public ContatoService(ContatoRepository contatoRepository, ProfissionalRepository profissionalRepository) {
        this.contatoRepository = contatoRepository;
        this.profissionalRepository = profissionalRepository;
    }

    public ContatoResponseDTO criarContato(ContatoDTO dto) {
        Profissional profissional = profissionalRepository.findById(dto.getProfissionalId())
            .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

        Contato contato = new Contato();
        contato.setNome(dto.getNome());
        contato.setContato(dto.getContato());
        contato.setCreated_date(dto.getCreated_date());
        contato.setProfissional(profissional);

        contatoRepository.save(contato);
        return ContatoMapper.toDTO(contato);
    }

    public List<ContatoResponseDTO> listarContatos(String q) {
        List<Contato> contatos;

        if (q != null && !q.isBlank()) {
            contatos = contatoRepository.findByNomeContainingIgnoreCaseOrContatoContainingIgnoreCase(q, q);
        } else {
            contatos = contatoRepository.findAll();
        }

        return contatos.stream().map(ContatoMapper::toDTO).collect(Collectors.toList());
    }

    public List<Map<String, Object>> listarComCamposSelecionados(String q, List<String> fields) {
        List<Contato> contatos;

        if (q != null && !q.isBlank()) {
            contatos = contatoRepository.findByNomeContainingIgnoreCaseOrContatoContainingIgnoreCase(q, q);
        } else {
            contatos = contatoRepository.findAll();
        }

        return contatos.stream().map(contato -> {
            var map = new HashMap<String, Object>();
            if (fields.contains("id")) map.put("id", contato.getId());
            if (fields.contains("nome")) map.put("nome", contato.getNome());
            if (fields.contains("contato")) map.put("contato", contato.getContato());
            if (fields.contains("created_date")) map.put("created_date", contato.getCreated_date());
            if (fields.contains("profissionalId") && contato.getProfissional() != null)
                map.put("profissionalId", contato.getProfissional().getId());
            return map;
        }).collect(Collectors.toList());
    }

    public Optional<ContatoResponseDTO> buscarPorId(Long id) {
        return contatoRepository.findById(id).map(ContatoMapper::toDTO);
    }

    public void atualizarContato(Long id, ContatoDTO dto) {
        Contato contato = contatoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contato não encontrado"));

        Profissional profissional = profissionalRepository.findById(dto.getProfissionalId())
            .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

        contato.setNome(dto.getNome());
        contato.setContato(dto.getContato());
        contato.setCreated_date(dto.getCreated_date());
        contato.setProfissional(profissional);

        contatoRepository.save(contato);
    }

    public void deletarContato(Long id) {
        Contato contato = contatoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contato não encontrado"));
        contatoRepository.delete(contato);
    }
}

