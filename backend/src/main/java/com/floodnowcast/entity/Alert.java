package com.floodnowcast.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alert")
public class Alert {
    public enum AlertSeverity { INFO, WARNING, HIGH, CRITICAL }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Enumerated(EnumType.STRING) private AlertSeverity severity;
    private String title;
    private String location;
    private String message;
    private String expectedTime;
    private LocalDateTime timestamp;
    private Boolean active;
    private Long streetId;
    private String nodeId;

    public Alert() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public AlertSeverity getSeverity() { return severity; }
    public void setSeverity(AlertSeverity severity) { this.severity = severity; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getExpectedTime() { return expectedTime; }
    public void setExpectedTime(String expectedTime) { this.expectedTime = expectedTime; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Long getStreetId() { return streetId; }
    public void setStreetId(Long streetId) { this.streetId = streetId; }
    public String getNodeId() { return nodeId; }
    public void setNodeId(String nodeId) { this.nodeId = nodeId; }

    // Builder pattern
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Alert a = new Alert();
        public Builder severity(AlertSeverity v) { a.severity = v; return this; }
        public Builder title(String v) { a.title = v; return this; }
        public Builder location(String v) { a.location = v; return this; }
        public Builder message(String v) { a.message = v; return this; }
        public Builder expectedTime(String v) { a.expectedTime = v; return this; }
        public Builder timestamp(LocalDateTime v) { a.timestamp = v; return this; }
        public Builder active(Boolean v) { a.active = v; return this; }
        public Builder streetId(Long v) { a.streetId = v; return this; }
        public Builder nodeId(String v) { a.nodeId = v; return this; }
        public Alert build() { return a; }
    }
}
