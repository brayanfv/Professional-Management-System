package com.brayanfavarin.professionalmanagement.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.brayanfavarin.professionalmanagement.dto.common.PageResponse;
import com.brayanfavarin.professionalmanagement.dto.department.DepartmentRequest;
import com.brayanfavarin.professionalmanagement.dto.department.DepartmentResponse;
import com.brayanfavarin.professionalmanagement.exception.ConflictException;
import com.brayanfavarin.professionalmanagement.exception.ResourceNotFoundException;
import com.brayanfavarin.professionalmanagement.mapper.DepartmentMapper;
import com.brayanfavarin.professionalmanagement.model.Department;
import com.brayanfavarin.professionalmanagement.repository.DepartmentRepository;
import com.brayanfavarin.professionalmanagement.repository.ProfessionalRepository;
@Service public class DepartmentService {
 private final DepartmentRepository departments; private final ProfessionalRepository professionals;
 public DepartmentService(DepartmentRepository departments, ProfessionalRepository professionals){this.departments=departments;this.professionals=professionals;}
 @Transactional(readOnly=true) public PageResponse<DepartmentResponse> list(String search, Pageable pageable){String normalizedSearch=InputNormalizer.optional(search);Page<Department> page=normalizedSearch==null?departments.findAll(pageable):departments.findByNameContainingIgnoreCase(normalizedSearch,pageable);return PageResponse.from(page,DepartmentMapper::toResponse);}
 @Transactional(readOnly=true) public DepartmentResponse get(Long id){return DepartmentMapper.toResponse(entity(id));}
 @Transactional public DepartmentResponse create(DepartmentRequest r){String name=InputNormalizer.required(r.name());if(departments.existsByNameIgnoreCase(name))throw new ConflictException("DUPLICATE_DEPARTMENT","Department name already exists");Department d=new Department();d.setName(name);d.setDescription(InputNormalizer.optional(r.description()));return DepartmentMapper.toResponse(departments.save(d));}
 @Transactional public DepartmentResponse update(Long id,DepartmentRequest r){String name=InputNormalizer.required(r.name());if(departments.existsByNameIgnoreCaseAndIdNot(name,id))throw new ConflictException("DUPLICATE_DEPARTMENT","Department name already exists");Department d=entity(id);d.setName(name);d.setDescription(InputNormalizer.optional(r.description()));return DepartmentMapper.toResponse(d);}
 @Transactional public void delete(Long id){Department d=entity(id);if(professionals.existsByDepartmentId(id))throw new ConflictException("DEPARTMENT_IN_USE","Department is in use");departments.delete(d);}
 private Department entity(Long id){return departments.findById(id).orElseThrow(()->new ResourceNotFoundException("DEPARTMENT_NOT_FOUND","Department not found"));}
}
