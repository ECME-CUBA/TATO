package com.tato.movil.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A HistorialVentas.
 */
@Entity
@Table(name = "historial_ventas")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class HistorialVentas implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "fecha_venta")
    private Instant fechaVenta;

    @Column(name = "comision_mensajeria")
    private Float comisionMensajeria;

    @Column(name = "cantidad")
    private Integer cantidad;

    @OneToOne
    @JoinColumn(unique = true)
    private Articulo articulo;

    @OneToOne
    @JoinColumn(unique = true)
    private Vendedor corredor;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public HistorialVentas id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getFechaVenta() {
        return this.fechaVenta;
    }

    public HistorialVentas fechaVenta(Instant fechaVenta) {
        this.setFechaVenta(fechaVenta);
        return this;
    }

    public void setFechaVenta(Instant fechaVenta) {
        this.fechaVenta = fechaVenta;
    }

    public Float getComisionMensajeria() {
        return this.comisionMensajeria;
    }

    public HistorialVentas comisionMensajeria(Float comisionMensajeria) {
        this.setComisionMensajeria(comisionMensajeria);
        return this;
    }

    public void setComisionMensajeria(Float comisionMensajeria) {
        this.comisionMensajeria = comisionMensajeria;
    }

    public Integer getCantidad() {
        return this.cantidad;
    }

    public HistorialVentas cantidad(Integer cantidad) {
        this.setCantidad(cantidad);
        return this;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Articulo getArticulo() {
        return this.articulo;
    }

    public void setArticulo(Articulo articulo) {
        this.articulo = articulo;
    }

    public HistorialVentas articulo(Articulo articulo) {
        this.setArticulo(articulo);
        return this;
    }

    public Vendedor getCorredor() {
        return this.corredor;
    }

    public void setCorredor(Vendedor vendedor) {
        this.corredor = vendedor;
    }

    public HistorialVentas corredor(Vendedor vendedor) {
        this.setCorredor(vendedor);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HistorialVentas)) {
            return false;
        }
        return id != null && id.equals(((HistorialVentas) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HistorialVentas{" +
            "id=" + getId() +
            ", fechaVenta='" + getFechaVenta() + "'" +
            ", comisionMensajeria=" + getComisionMensajeria() +
            ", cantidad=" + getCantidad() +
            "}";
    }
}
