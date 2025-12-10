import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import type { JobPosting } from '../types';
import './JobForum.css';

const JobForum: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([
    {
      id: '1',
      authorId: '1',
      authorName: 'Ahmet Yılmaz',
      title: 'Senior React Developer',
      description: 'İstanbul\'da çalışacak deneyimli React geliştirici arıyoruz.',
      company: 'Tech Corp',
      position: 'Senior',
      city: 'İstanbul',
      country: 'Türkiye',
      seniority: 'Senior',
      jobType: 'Full-time',
      salary: '15.000 - 20.000 TL',
      requirements: ['React', 'TypeScript', '5+ yıl tecrübe'],
      benefits: ['Remote Work', 'Health Insurance'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    position: 'Junior' as const,
    city: '',
    country: '',
    seniority: 'Mid' as const,
    jobType: 'Full-time' as const,
    salary: '',
  });

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.company) {
      alert('Lütfen tüm zorunlu alanları doldurunuz');
      return;
    }

    const newJob: JobPosting = {
      id: Date.now().toString(),
      authorId: '1',
      authorName: 'Benim',
      title: formData.title,
      description: formData.description,
      company: formData.company,
      position: formData.position,
      city: formData.city,
      country: formData.country,
      seniority: formData.seniority,
      jobType: formData.jobType,
      salary: formData.salary,
      requirements: [],
      benefits: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    setJobs([newJob, ...jobs]);
    setFormData({
      title: '',
      description: '',
      company: '',
      position: 'Junior',
      city: '',
      country: '',
      seniority: 'Mid',
      jobType: 'Full-time',
      salary: '',
    });
    setShowForm(false);
  };

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  return (
    <div className="job-forum">
      <div className="forum-header">
        <h2>İş İlanları Forumu</h2>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <FaPlus /> İlan Ekle
        </button>
      </div>

      {showForm && (
        <div className="job-form-container">
          <form onSubmit={handleAddJob} className="job-form">
            <div className="form-row">
              <div className="form-group">
                <label>İş Başlığı *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="React Developer"
                  required
                />
              </div>
              <div className="form-group">
                <label>Şirket Adı *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Tech Corp"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Şehir</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="İstanbul"
                />
              </div>
              <div className="form-group">
                <label>Ülke</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Türkiye"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Seviye</label>
                <select
                  value={formData.seniority}
                  onChange={(e) => setFormData({ ...formData, seniority: e.target.value as any })}
                >
                  <option>Intern</option>
                  <option>Junior</option>
                  <option>Mid</option>
                  <option>Senior</option>
                </select>
              </div>
              <div className="form-group">
                <label>İş Türü</label>
                <select
                  value={formData.jobType}
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value as any })}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Freelance</option>
                  <option>Contract</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Maaş Aralığı</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="15.000 - 20.000 TL"
              />
            </div>

            <div className="form-group">
              <label>Açıklama *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="İş detaylarını yazınız..."
                rows={4}
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Yayınla</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <div className="no-jobs">
            <p>Henüz iş ilanı yok. İlk ilanı siz ekleyin!</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <div className="job-title-section">
                  <h3>{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                </div>
                <div className="job-badges">
                  <span className="badge severity">{job.seniority}</span>
                  <span className="badge type">{job.jobType}</span>
                </div>
              </div>

              <p className="job-description">{job.description}</p>

              <div className="job-meta">
                <div className="meta-item">
                  <span className="label">Konum:</span>
                  <span className="value">{job.city}, {job.country}</span>
                </div>
                {job.salary && (
                  <div className="meta-item">
                    <span className="label">Maaş:</span>
                    <span className="value">{job.salary}</span>
                  </div>
                )}
              </div>

              <div className="job-footer">
                <small className="author">Paylaşan: {job.authorName}</small>
                <div className="job-actions">
                  <button className="btn-icon" title="Düzenle">
                    <FaEdit />
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDeleteJob(job.id)}
                    title="Sil"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobForum;
