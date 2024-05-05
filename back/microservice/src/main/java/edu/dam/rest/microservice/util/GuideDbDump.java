package edu.dam.rest.microservice.util;

import edu.dam.rest.microservice.persistence.model.GuideType;
import edu.dam.rest.microservice.persistence.repository.GuideTypeRepository;
import edu.dam.rest.microservice.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GuideDbDump {

    private GuideTypeRepository guideTypeRepository;

    @Autowired
    public GuideDbDump(GuideTypeRepository guideTypeRepository) {
        this.guideTypeRepository = guideTypeRepository;
    }

    public void dbDump(String guideType) {
        if (!this.guideTypeRepository.existsByType(guideType)) {
            this.guideTypeRepository.save(GuideType.builder().type(guideType).build());
        }
    }

    public void dumpitongui() {
        this.dbDump("cocina");this.dbDump("jardinería");this.dbDump("manualidades");this.dbDump("fitness");
        this.dbDump("viajes");this.dbDump("tecnología");this.dbDump("belleza");this.dbDump("moda");
        this.dbDump("salud");this.dbDump("bienestar");this.dbDump("educación");this.dbDump("paternidad");
        this.dbDump("finanzas");this.dbDump("fotografía");this.dbDump("mascotas");this.dbDump("música");
        this.dbDump("pintura");this.dbDump("escultura");this.dbDump("sostenibilidad");this.dbDump("idiomas");
        this.dbDump("supervivencia");this.dbDump("naturaleza");this.dbDump("meditación");this.dbDump("salud_mental");
        this.dbDump("hogar");this.dbDump("relaciones");this.dbDump("amor");this.dbDump("deportes");
        this.dbDump("historia");this.dbDump("arte");this.dbDump("trabajo");this.dbDump("videojuegos");
        this.dbDump("cultural");

    }

}
