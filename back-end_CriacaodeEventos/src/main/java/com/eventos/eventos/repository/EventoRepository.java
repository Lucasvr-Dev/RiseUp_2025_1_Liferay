package com.eventos.eventos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.eventos.eventos.model.Evento;

public interface EventoRepository extends JpaRepository<Evento, Long> {
}
