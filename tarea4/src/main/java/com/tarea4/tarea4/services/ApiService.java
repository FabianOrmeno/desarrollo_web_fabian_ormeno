package com.tarea4.tarea4.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

import com.tarea4.tarea4.models.Avistamiento;
import com.tarea4.tarea4.models.AvistamientoRepository;
import com.tarea4.tarea4.models.Nota;
import com.tarea4.tarea4.models.NotaRepository;

@Service
public class ApiService {
    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;
    public ApiService(AvistamientoRepository avistamientoRepository, NotaRepository notaRepository) {
        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
    }

    public List<Map<String, Map.Entry<String, Boolean>>> getAvistamientos(String filterText) {
        List<Avistamiento> avistamientos = avistamientoRepository.findAllByOrderByIdDesc();
        List<Map<String, Map.Entry<String, Boolean>>> avistamientosData = new ArrayList<>();
        for (Avistamiento avis : avistamientos) {
            if (avis.getAve().getNombre().toLowerCase().contains(filterText.toLowerCase()) ||
                avis.getVoluntario().getNombre().toLowerCase().contains(filterText.toLowerCase()) ||
                avis.getComuna().getNombre().toLowerCase().contains(filterText.toLowerCase()) ||
                avis.getFechaHora().toString().toLowerCase().contains(filterText.toLowerCase())) {

                List<Nota> notas = notaRepository.findByAvistamientoId(avis.getId());
                String promedio = notas.isEmpty() ? "-"
                    : String.format("%.1f",notas.stream().mapToInt(Nota::getNota).average().orElse(0.0));
                    
                Map<String, Map.Entry<String, Boolean>> avisData = new HashMap<>();
                avisData.put("id", Map.entry(avis.getId().toString(),false));
                String nombre = avis.getAve().getNombre();
                avisData.put("nombre", Map.entry(nombre, nombre.toLowerCase().contains(filterText)));
                String voluntario = avis.getVoluntario().getNombre();
                avisData.put("voluntario", Map.entry(voluntario, voluntario.toLowerCase().contains(filterText)));
                String comuna = avis.getComuna().getNombre();
                avisData.put("comuna", Map.entry(comuna, comuna.toLowerCase().contains(filterText)));
                String fecha = avis.getFechaHora().toString();
                avisData.put("fecha", Map.entry(fecha, fecha.toLowerCase().contains(filterText)));
                avisData.put("promedio", Map.entry(promedio, false));
                avistamientosData.add(avisData);
            }
        }
        return avistamientosData;
    }

    public void handleCreateNota(Integer avistamientoId, int nota){
        Avistamiento avistamiento = avistamientoRepository.findById(avistamientoId).orElse(null);
        if(Nota.validateNota(avistamiento, nota)){
            Nota evaluacion = new Nota(avistamiento, nota);
            notaRepository.save(evaluacion);
            System.out.println("Note saved successfully.");
        } else {
            throw new IllegalArgumentException("Note validation failed.");
        }
    }
}