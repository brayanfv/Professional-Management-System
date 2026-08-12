package spring.boot.simplesdental.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import spring.boot.simplesdental.model.Profissional;

public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
    
        List<Profissional> findByNomeContainingIgnoreCaseOrCargoContainingIgnoreCase(String nome, String cargo);

}
