import React, { useState, useEffect } from 'react';

export default function AdminResources() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("College / University Faculty");
  const [competency, setCompetency] = useState("");
  const [status, setStatus] = useState("initial"); // initial, uploading, generating, success, error
  const [message, setMessage] = useState("");
  const [resources, setResources] = useState([]);
  
  const fetchResources = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/resources');
      const data = await res.json();
      if (data.success) {
        setResources(data.resources || []);
      }
    } catch (err) {
      console.error("Failed to fetch resources", err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    setStatus("uploading");
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("role", role);
    formData.append("competency", competency);
    formData.append("competency_id", `COMP-${competency.toUpperCase().replace(/\s+/g, '-')}`);
    formData.append("domain", "General");
    
    try {
      // It happens fast, but to show UI states clearly
      setTimeout(() => setStatus("generating"), 800);
      
      const res = await fetch('http://localhost:8000/api/resources', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus("success");
        setMessage(`Resource added successfully: ${data.resource.title} (${data.resource.question_count} questions generated).`);
        fetchResources(); // Refresh list
        
        // Reset form
        setFile(null);
        setTitle("");
        setCompetency("");
      } else {
        setStatus("error");
        setMessage(data.detail || "We couldn't generate the assessment. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("We couldn't generate the assessment. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex flex-col gap-2 mb-8 border-b border-outline-variant/30 pb-6">
        <h2 className="font-display text-3xl sm:text-4xl text-primary tracking-tight">Learning Resources</h2>
        <p className="font-body-md text-on-surface-variant max-w-2xl text-base sm:text-lg">
          Upload and manage PDF learning resources to automatically generate AI assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-display text-xl text-primary mb-4">Add Learning Resource</h3>
            
            {status === 'success' && (
              <div className="mb-4 p-4 bg-teal-brand/10 border border-teal-brand/20 text-teal-brand rounded-xl">
                <span className="flex items-center gap-2 font-bold mb-1">
                  <span className="material-symbols-outlined">check_circle</span>
                  Success
                </span>
                <p className="text-sm">{message}</p>
                <button 
                  onClick={() => setStatus('initial')} 
                  className="mt-3 text-xs font-bold uppercase hover:underline"
                >
                  Upload Another
                </button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="mb-4 p-4 bg-error/10 border border-error/20 text-error rounded-xl">
                <span className="flex items-center gap-2 font-bold mb-1">
                  <span className="material-symbols-outlined">error</span>
                  Error
                </span>
                <p className="text-sm">{message}</p>
                <button 
                  onClick={() => setStatus('initial')} 
                  className="mt-3 text-xs font-bold uppercase hover:underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {(status === 'initial' || status === 'uploading' || status === 'generating') && (
              <form onSubmit={handleUpload} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">PDF File *</label>
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={e => setFile(e.target.files[0])}
                    className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    disabled={status !== 'initial'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Resource Title *</label>
                  <input 
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Introduction to Machine Learning"
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    disabled={status !== 'initial'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Role / Audience</label>
                  <select 
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    disabled={status !== 'initial'}
                  >
                    <option value="College / University Faculty">College / University Faculty</option>
                    <option value="Statistical Officer">Statistical Officer</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Competency / Topic</label>
                  <input 
                    type="text"
                    value={competency}
                    onChange={e => setCompetency(e.target.value)}
                    placeholder="e.g. Artificial Intelligence"
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    disabled={status !== 'initial'}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status !== 'initial' || !file || !title}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    status === 'initial' && file && title
                      ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-md'
                      : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
                  }`}
                >
                  {status === 'initial' && (
                    <><span className="material-symbols-outlined">auto_awesome</span> Generate Quiz</>
                  )}
                  {status === 'uploading' && (
                    <><span className="material-symbols-outlined animate-spin">sync</span> Uploading...</>
                  )}
                  {status === 'generating' && (
                    <><span className="material-symbols-outlined animate-spin">sync</span> Generating assessment questions...</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Resource List */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-display text-xl text-primary mb-4 flex justify-between items-center">
              Existing Resources
              <span className="text-sm font-body-md text-on-surface-variant bg-surface-variant/50 px-2 py-1 rounded-md">
                {resources.length} Items
              </span>
            </h3>

            {resources.length === 0 ? (
              <div className="text-center py-10 text-on-surface-variant border-2 border-dashed border-outline-variant/30 rounded-xl">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">library_books</span>
                <p>No resources uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {resources.map((res, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border border-outline-variant/30 rounded-xl hover:bg-surface-container/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-teal-brand/10 text-teal-brand flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">picture_as_pdf</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">{res.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">badge</span>
                            {res.role}
                          </span>
                          {res.competency && (
                            <span className="flex items-center gap-1 bg-surface-variant/50 px-2 py-0.5 rounded-sm">
                              <span className="material-symbols-outlined text-[14px]">category</span>
                              {res.competency}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm shrink-0 sm:ml-auto w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-outline-variant/30 pt-3 sm:pt-0 mt-2 sm:mt-0">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Questions</span>
                        <span className="font-bold text-primary">{res.question_count || 0}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Status</span>
                        {res.status === 'ready' ? (
                          <span className="px-2 py-0.5 bg-[#d4edda] text-[#155724] rounded text-xs font-bold">Ready</span>
                        ) : res.status === 'failed' ? (
                          <span className="px-2 py-0.5 bg-error/20 text-error rounded text-xs font-bold">Failed</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-saffron/20 text-[#9c5e00] rounded text-xs font-bold">{res.status}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
