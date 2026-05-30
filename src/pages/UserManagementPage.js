import React, { useEffect, useState } from 'react';

import { supabase } from '../supabase';

export default function UserManagementPage({ setCurrentPage }) {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showHierarchy, setShowHierarchy] = useState(false);

  const [hierarchy, setHierarchy] = useState([
    {
      position_title: 'Member Incharge',
      member_name: '',
      image_url: '',
    },
    {
      position_title: 'Mukhya Sanchalak',
      member_name: '',
      image_url: '',
    },
    {
      position_title: 'Up Mukhya Sanchalak (Field & HQ)',
      member_name: '',
      image_url: '',
    },
    {
      position_title: 'Up Mukhya Sanchalak (Administration)',
      member_name: '',
      image_url: '',
    },
    {
      position_title: 'Up Mukhya Sanchalak (Field & Training)',
      member_name: '',
      image_url: '',
    },
  ]);

  async function fetchUsers() {
    setLoading(true);

    const { data, error } = await supabase

      .from('users')

      .select('*')

      .order('full_name', {
        ascending: true,
      });

    setLoading(false);

    if (error) {
      alert(error.message);

      return;
    }

    setUsers(data || []);
  }

  async function promoteUser(id) {
    const { error } = await supabase

      .from('users')

      .update({
        role: 'admin',
      })

      .eq('id', id);

    if (error) {
      alert(error.message);

      return;
    }

    fetchUsers();
  }

  async function demoteUser(id) {
    const { error } = await supabase

      .from('users')

      .update({
        role: 'member',
      })

      .eq('id', id);

    if (error) {
      alert(error.message);

      return;
    }

    fetchUsers();
  }
  async function fetchHierarchy() {
    const { data } = await supabase

      .from('hierarchy')

      .select('*');

    if (data) {
      const ordered = [
        'Member Incharge',
        'Mukhya Sanchalak',
        'Up Mukhya Sanchalak (Field & HQ)',
        'Up Mukhya Sanchalak (Administration)',
        'Up Mukhya Sanchalak (Field & Training)',
      ];

      const sorted = [...data].sort(
        (a, b) =>
          ordered.indexOf(a.position_title) - ordered.indexOf(b.position_title)
      );

      setHierarchy(sorted);
    }
  }

  async function saveHierarchy() {
    console.log("SAVING:");
    console.log(hierarchy);
  
    for (const item of hierarchy) {
      const { error } = await supabase.from('hierarchy').upsert(item, {
        onConflict: 'position_title',
      });

      console.log(item, error);

      if (error) {
        alert(error.message);
        return;
      }
    }

    alert('Hierarchy saved.');
  }
  async function uploadImage(file, positionTitle) {
    console.log("FUNCTION STARTED");
  
    if (!file) {
      console.log("NO FILE");
      return;
    }
  
    console.log("FILE:", file);
  
    const fileName = `${Date.now()}-${file.name}`;
  
    console.log("FILENAME:", fileName);
  
    const result = await supabase.storage
      .from("hierarchy")
      .upload(fileName, file);
  
    console.log("UPLOAD RESULT:", result);
  
    if (result.error) {
      console.log("UPLOAD ERROR:", result.error);
      alert(result.error.message);
      return;
    }
  
    console.log("UPLOAD SUCCESS");
  
    const publicUrlResult = supabase.storage
      .from("hierarchy")
      .getPublicUrl(fileName);
  
    console.log("PUBLIC URL RESULT:", publicUrlResult);
  
    const url = publicUrlResult.data.publicUrl;
  
    console.log("URL:", url);
    console.log("POSITION:", positionTitle);
  
    setHierarchy((prev) =>
      prev.map((item) =>
        item.position_title === positionTitle
          ? {
              ...item,
              image_url: url,
            }
          : item
      )
    );
  
    console.log("STATE UPDATED");
  }
  useEffect(() => {
    fetchUsers();
    fetchHierarchy();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',

        backgroundColor: '#f6f2ee',

        padding: '28px',

        fontFamily: 'Inter, sans-serif',

        boxSizing: 'border-box',
      }}
    >
      <button
        onClick={() => setCurrentPage('dashboard')}
        style={{
          background: 'none',

          border: 'none',

          color: '#777',

          cursor: 'pointer',

          marginBottom: '28px',

          padding: 0,

          fontSize: '15px',
        }}
      >
        ← Back
      </button>

      <h1
        style={{
          fontFamily: 'Playfair Display, serif',

          fontSize: '48px',

          marginTop: 0,

          marginBottom: '28px',

          color: '#1f1f23',
        }}
      >
        Users & Management
      </h1>
      <button
        onClick={() => setShowHierarchy(true)}
        style={{
          padding: '14px 24px',

          borderRadius: '999px',

          border: 'none',

          backgroundColor: '#1f1f23',

          color: 'white',

          cursor: 'pointer',

          marginBottom: '24px',
        }}
      >
        Manage Hierarchy
      </button>
      <div
        style={{
          backgroundColor: 'white',

          borderRadius: '30px',

          padding: '24px',

          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'grid',

            gridTemplateColumns: '1.5fr 1fr 1fr 1fr',

            gap: '12px',

            fontWeight: '700',

            color: '#777',

            marginBottom: '16px',
          }}
        >
          <div>Name</div>

          <div>Current</div>

          <div>Promote</div>

          <div>Demote</div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              style={{
                display: 'grid',

                gridTemplateColumns: '1.5fr 1fr 1fr 1fr',

                gap: '12px',

                alignItems: 'center',

                padding: '16px 0',

                borderTop: '1px solid #eee',
              }}
            >
              <div
                style={{
                  fontWeight: '500',

                  color: '#1f1f23',
                }}
              >
                {user.full_name}
              </div>

              <div
                style={{
                  color: '#777',

                  fontWeight: '600',

                  textTransform: 'capitalize',
                }}
              >
                {user.role}
              </div>

              <button
                onClick={() => promoteUser(user.id)}
                disabled={user.role === 'admin'}
                style={{
                  padding: '12px',

                  borderRadius: '999px',

                  border: 'none',

                  backgroundColor: '#1f1f23',

                  color: 'white',

                  cursor: 'pointer',

                  opacity: user.role === 'admin' ? 0.4 : 1,
                }}
              >
                Promote
              </button>

              <button
                onClick={() => demoteUser(user.id)}
                disabled={user.role === 'member'}
                style={{
                  padding: '12px',

                  borderRadius: '999px',

                  border: '1px solid #ddd',

                  backgroundColor: 'white',

                  color: '#1f1f23',

                  cursor: 'pointer',

                  opacity: user.role === 'member' ? 0.4 : 1,
                }}
              >
                Demote
              </button>
            </div>
          ))
        )}
      </div>
      {showHierarchy && (
        <div
          style={{
            position: 'fixed',

            inset: 0,

            background: 'rgba(0,0,0,0.5)',

            display: 'flex',

            justifyContent: 'center',

            alignItems: 'center',

            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: '90%',

              maxWidth: '900px',

              maxHeight: '85vh',

              overflowY: 'auto',

              background: 'white',

              borderRadius: '30px',

              padding: '24px',
            }}
          >
            <h2>Manage Hierarchy</h2>

            {hierarchy.map((item, index) => (
              <div
                key={item.position_title}
                style={{
                  border: '1px solid #eee',

                  borderRadius: '20px',

                  padding: '20px',

                  marginBottom: '18px',
                }}
              >
                <h3>{item.position_title}</h3>

                <input
                  value={item.member_name}
                  placeholder="Member Name"
                  onChange={(e) => {
                    const copy = [...hierarchy];

                    copy[index].member_name = e.target.value;

                    setHierarchy(copy);
                  }}
                  style={{
                    width: '100%',

                    padding: '12px',

                    marginBottom: '12px',
                  }}
                />

                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt=""
                    style={{
                      width: '120px',

                      height: '120px',

                      objectFit: 'cover',

                      borderRadius: '16px',

                      display: 'block',

                      marginBottom: '12px',
                    }}
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    console.log("FILE PICKER FIRED");
                    uploadImage(e.target.files?.[0], item.position_title);
                  }}
                  
                />
              </div>
            ))}

            <div
              style={{
                display: 'flex',

                gap: '12px',
              }}
            >
              <button onClick={saveHierarchy}>Save</button>

              <button onClick={() => setShowHierarchy(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
