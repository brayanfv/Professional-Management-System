package spring.boot.simplesdental.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import spring.boot.simplesdental.dto.ContatoDTO;
import spring.boot.simplesdental.dto.ContatoResponseDTO;
import spring.boot.simplesdental.service.ContatoService;

@RestController
@RequestMapping("/contatos")
public class ContatoController {

    private final ContatoService contatoService;

    public ContatoController(ContatoService contatoService) {
        this.contatoService = contatoService;
    }


    @PostMapping
    public ResponseEntity<?> criarContato(@RequestBody @Valid ContatoDTO dto) {
        try {
            ContatoResponseDTO contato = contatoService.criarContato(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Sucesso: contato com id " + contato.getId() + " cadastrado");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listarContatos(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) List<String> fields
    ) {
        if (fields == null || fields.isEmpty()) {
            List<ContatoResponseDTO> dtos = contatoService.listarContatos(q);
            return ResponseEntity.ok(dtos);
        } else {
            return ResponseEntity.ok(contatoService.listarComCamposSelecionados(q, fields));
        }
    }

   
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Optional<ContatoResponseDTO> optional = contatoService.buscarPorId(id);

        if (optional.isPresent()) {
            return ResponseEntity.ok(optional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Contato não encontrado");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarContato(@PathVariable Long id, @RequestBody @Valid ContatoDTO dto) {
        try {
            contatoService.atualizarContato(id, dto);
            return ResponseEntity.ok("Sucesso: contato alterado");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarContato(@PathVariable Long id) {
        try {
            contatoService.deletarContato(id);
            return ResponseEntity.ok("Sucesso: contato excluído");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}

