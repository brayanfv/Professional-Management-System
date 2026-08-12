package spring.boot.simplesdental.model;

import java.time.LocalDate;


import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String contato;
    private LocalDate created_date;

    @ManyToOne
    @JoinColumn(name = "profissional_id")
    @JsonBackReference
    private Profissional profissional;
    
    @PrePersist
    protected void onCreate() {
        if (created_date == null) {
            created_date = LocalDate.now();
        }
    }

}
