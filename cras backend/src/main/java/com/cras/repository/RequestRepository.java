package com.cras.repository;

import com.cras.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {

    List<Request> findAllByOrderByPriorityScoreDesc();
}
