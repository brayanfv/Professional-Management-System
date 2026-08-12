package spring.boot.simplesdental.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import spring.boot.simplesdental.model.Contato;

public interface ContatoRepository extends JpaRepository<Contato, Long> {

    List<Contato> findByNomeContainingIgnoreCaseOrContatoContainingIgnoreCase(String nome, String contato);

    
}
