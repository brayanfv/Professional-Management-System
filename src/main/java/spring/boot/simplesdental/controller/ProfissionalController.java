package spring.boot.simplesdental.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import spring.boot.simplesdental.dto.ContatoResponseDTO;
import spring.boot.simplesdental.dto.ProfissionalDTO;
import spring.boot.simplesdental.dto.ProfissionalResponseDTO;
import spring.boot.simplesdental.mapper.ProfissionalMapper;
import spring.boot.simplesdental.model.Profissional;
import spring.boot.simplesdental.service.ProfissionalService;

@RestController
@RequestMapping("/profissionais")
public class ProfissionalController {
    
    @Autowired
    private ProfissionalService profissionalService;

    @PostMapping
    public ResponseEntity<Profissional> criarProfissional(@RequestBody ProfissionalDTO dto) {
        Profissional profissionalSalvo = profissionalService.salvarProfissional(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(profissionalSalvo);
    }    

    @GetMapping
    public ResponseEntity<?> listarProfissionais(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) List<String> fields
    )  {
    if (fields == null || fields.isEmpty()) {
        List<ProfissionalResponseDTO> dtos = profissionalService.listarTodos(q);
        return ResponseEntity.ok(dtos);
    } else {
        return ResponseEntity.ok(profissionalService.listarComCamposSelecionados(q, fields));
    }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Optional<Profissional> profissionalOpt = profissionalService.buscarPorId(id);
        if (profissionalOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profissional não encontrado");
        }
        ProfissionalResponseDTO dto = ProfissionalMapper.toDTO(profissionalOpt.get());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarProfissional(@PathVariable Long id, @RequestBody @Valid ProfissionalDTO dto) {
    try {
        Profissional atualizado = profissionalService.atualizarProfissional(id, dto);
        return ResponseEntity.ok("Profissional com ID " + atualizado.getId() + " atualizado com sucesso");
    } catch (RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarProfissional(@PathVariable Long id) {
        Optional<Profissional> profissionalOpt = profissionalService.buscarPorId(id);
        if (profissionalOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profissional não encontrado");
        }

        profissionalService.deletarProfissional(id);
        return ResponseEntity.ok("Profissional com ID " + id + " deletado com sucesso");
    }

    @GetMapping("/{id}/contatos")
    public ResponseEntity<List<ContatoResponseDTO>> listarContatos(@PathVariable Long id) {
        return ResponseEntity.ok(profissionalService.listarContatosPorCliente(id));
    }

}
