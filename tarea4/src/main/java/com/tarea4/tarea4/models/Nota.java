package com.tarea4.tarea4.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table
public class Nota {
    @Id
    @SequenceGenerator(
        name = "sighting_sequence",
        sequenceName = "sighting_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "sighting_sequence"
    )
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "avistamiento_id", nullable = false)
    private Avistamiento avistamiento;

    @NotNull
    private Integer nota;

    public Integer getId() {
        return id;
    }

    public  Avistamiento getAvistamiento() {
        return avistamiento;
    }

    public Integer getNota() {
    return nota;
    }

    public Nota() {
    }

    public Nota(Avistamiento avistamiento, Integer nota) {
        this.avistamiento = avistamiento;
        this.nota = nota;
    }

    public static Boolean validateNota(Avistamiento avistamiento, Integer nota) {
        if(avistamiento == null){
            return false;
        }
        if (nota == null || nota < 1 || nota > 7){
            return false;
        }
        return true;
    }
}
