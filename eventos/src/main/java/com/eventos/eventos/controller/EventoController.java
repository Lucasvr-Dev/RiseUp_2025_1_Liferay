package com.eventos.eventos.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.eventos.eventos.model.Evento;
import com.eventos.eventos.repository.EventoRepository;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class EventoController {

    @Autowired
    private EventoRepository eventoRepository;

    @PostMapping
    public Evento criarEvento(@RequestBody Evento evento) {
        return eventoRepository.save(evento);
    }

    @GetMapping
    public List<Evento> listarEventos() {
        return eventoRepository.findAll();
    }
}
