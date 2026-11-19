package com.tarea4.tarea4.services;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import com.tarea4.tarea4.models.Avistamiento;
import com.tarea4.tarea4.models.AvistamientoRepository;
import com.tarea4.tarea4.models.Nota;
import com.tarea4.tarea4.models.NotaRepository;

@Service
public class AppService {

    private final String pathStatic;
    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;

    public AppService(AvistamientoRepository avistamientoRepository, NotaRepository notaRepository) throws IOException {
        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
        // Dynamically resolve the absolute path for the static directory
        Path staticDir = Paths.get(ResourceUtils.getFile("classpath:static").getAbsolutePath());
        this.pathStatic = staticDir.toString();
        System.out.println("Static path resolved to: " + this.pathStatic);
    }

    public List<Map<String, Map.Entry<String, Boolean>>> getAvistamientosData() {
        List<Avistamiento> avistamientos = avistamientoRepository.findAllByOrderByIdDesc();
        List<Map<String, Map.Entry<String, Boolean>>> avistamientosData = new ArrayList<>();
        
        for (Avistamiento avis : avistamientos) {
            List<Nota> notas = notaRepository.findByAvistamientoId(avis.getId());
            String promedio = notas.isEmpty()? "-"
                : String.format("%.1f",notas.stream().mapToInt(Nota::getNota).average().orElse(0.0));

            Map<String, Map.Entry<String, Boolean>> avisData = new HashMap<>();
            avisData.put("id", Map.entry(avis.getId().toString(),false));
            avisData.put("nombre", Map.entry(avis.getAve().getNombre(), false));
            avisData.put("voluntario", Map.entry(avis.getVoluntario().getNombre(),false));
            avisData.put("comuna", Map.entry(avis.getComuna().getNombre(), false));
            avisData.put("fecha", Map.entry(avis.getFechaHora().toString(),false));
            avisData.put("promedio", Map.entry(promedio, false));

            avistamientosData.add(avisData);
        }
        return avistamientosData;
    }
}