package com.brayanfavarin.professionalmanagement.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.brayanfavarin.professionalmanagement.dto.common.PageResponse;
import com.brayanfavarin.professionalmanagement.dto.position.PositionRequest;
import com.brayanfavarin.professionalmanagement.dto.position.PositionResponse;
import com.brayanfavarin.professionalmanagement.exception.ConflictException;
import com.brayanfavarin.professionalmanagement.exception.ResourceNotFoundException;
import com.brayanfavarin.professionalmanagement.mapper.PositionMapper;
import com.brayanfavarin.professionalmanagement.model.Position;
import com.brayanfavarin.professionalmanagement.repository.PositionRepository;
import com.brayanfavarin.professionalmanagement.repository.ProfessionalRepository;
@Service public class PositionService {
 private final PositionRepository positions; private final ProfessionalRepository professionals;
 public PositionService(PositionRepository positions, ProfessionalRepository professionals){this.positions=positions;this.professionals=professionals;}
 @Transactional(readOnly=true) public PageResponse<PositionResponse> list(String search, Pageable pageable){Page<Position> page=search==null||search.isBlank()?positions.findAll(pageable):positions.findByNameContainingIgnoreCase(search,pageable);return PageResponse.from(page,PositionMapper::toResponse);}
 @Transactional(readOnly=true) public PositionResponse get(Long id){return PositionMapper.toResponse(entity(id));}
 @Transactional public PositionResponse create(PositionRequest r){if(positions.existsByNameIgnoreCase(r.name()))throw new ConflictException("DUPLICATE_POSITION","Position name already exists");Position p=new Position();p.setName(r.name());p.setDescription(r.description());return PositionMapper.toResponse(positions.save(p));}
 @Transactional public PositionResponse update(Long id,PositionRequest r){if(positions.existsByNameIgnoreCaseAndIdNot(r.name(),id))throw new ConflictException("DUPLICATE_POSITION","Position name already exists");Position p=entity(id);p.setName(r.name());p.setDescription(r.description());return PositionMapper.toResponse(p);}
 @Transactional public void delete(Long id){Position p=entity(id);if(professionals.existsByPositionId(id))throw new ConflictException("POSITION_IN_USE","Position is in use");positions.delete(p);}
 private Position entity(Long id){return positions.findById(id).orElseThrow(()->new ResourceNotFoundException("POSITION_NOT_FOUND","Position not found"));}
}
