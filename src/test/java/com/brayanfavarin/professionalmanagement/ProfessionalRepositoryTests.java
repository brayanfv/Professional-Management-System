package com.brayanfavarin.professionalmanagement;

import static org.assertj.core.api.Assertions.assertThat;

import org.hibernate.Hibernate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ActiveProfiles;

import com.brayanfavarin.professionalmanagement.model.Department;
import com.brayanfavarin.professionalmanagement.model.Position;
import com.brayanfavarin.professionalmanagement.model.Professional;
import com.brayanfavarin.professionalmanagement.repository.DepartmentRepository;
import com.brayanfavarin.professionalmanagement.repository.PositionRepository;
import com.brayanfavarin.professionalmanagement.repository.ProfessionalRepository;

import jakarta.persistence.EntityManager;

@DataJpaTest
@ActiveProfiles("test")
class ProfessionalRepositoryTests {

    @Autowired
    ProfessionalRepository professionals;

    @Autowired
    DepartmentRepository departments;

    @Autowired
    PositionRepository positions;

    @Autowired
    EntityManager entityManager;

    @Test
    void listEntityGraphLoadsDepartmentAndPositionButNotContacts() {
        Department department = new Department();
        department.setName("Technology");
        department = departments.save(department);

        Position position = new Position();
        position.setName("Software Developer");
        position = positions.save(position);

        Professional professional = new Professional();
        professional.setName("Graph Test Professional");
        professional.setDepartment(department);
        professional.setPosition(position);
        professionals.save(professional);

        entityManager.flush();
        entityManager.clear();

        Specification<Professional> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("name"), "Graph Test Professional");
        Page<Professional> page = professionals.findAll(specification, PageRequest.of(0, 10));
        Professional loaded = page.getContent().getFirst();

        assertThat(Hibernate.isInitialized(loaded.getDepartment())).isTrue();
        assertThat(Hibernate.isInitialized(loaded.getPosition())).isTrue();
        assertThat(Hibernate.isInitialized(loaded.getContacts())).isFalse();
        assertThat(loaded.getDepartment().getName()).isEqualTo("Technology");
        assertThat(loaded.getPosition().getName()).isEqualTo("Software Developer");
    }
}
