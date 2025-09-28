import './PrescriptionsPage.css'

const PrescriptionsPage = () => {
  return (
    <main className="prescriptions-page">
      <div className="page-container">
        <div className="page-header">
          <h1>📋 Prescriptions</h1>
          <p>Manage your prescriptions and medication history</p>
        </div>

        <div className="prescriptions-content">
          <div className="prescription-card">
            <div className="prescription-header">
              <h3>Prescription #PR-2024-001</h3>
              <span className="status active">Active</span>
            </div>
            <div className="prescription-details">
              <p><strong>Doctor:</strong> Dr.S Jayasinghe</p>
              <p><strong>Date:</strong> March 15, 2024</p>
              <p><strong>Medication:</strong> Amoxicillin 500mg</p>
              <p><strong>Dosage:</strong> 1 tablet, 3 times daily</p>
              <p><strong>Duration:</strong> 7 days</p>
            </div>
            <div className="prescription-actions">
              <button className="btn btn-primary">View Details</button>
              <button className="btn btn-outline">Download PDF</button>
            </div>
          </div>

          <div className="prescription-card">
            <div className="prescription-header">
              <h3>Prescription #PR-2024-002</h3>
              <span className="status completed">Completed</span>
            </div>
            <div className="prescription-details">
              <p><strong>Doctor:</strong> Dr.C Perera</p>
              <p><strong>Date:</strong> March 10, 2024</p>
              <p><strong>Medication:</strong> Ibuprofen 400mg</p>
              <p><strong>Dosage:</strong> 1 tablet, twice daily</p>
              <p><strong>Duration:</strong> 5 days</p>
            </div>
            <div className="prescription-actions">
              <button className="btn btn-primary">View Details</button>
              <button className="btn btn-outline">Download PDF</button>
            </div>
          </div>

          <div className="no-prescriptions">
            <div className="no-prescriptions-content">
              <span className="icon">📋</span>
              <h3>No Recent Prescriptions</h3>
              <p>Your prescription history will appear here</p>
              <button className="btn btn-primary">Request Prescription</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PrescriptionsPage
