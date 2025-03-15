import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { setEmployerCredentials } from '@/features/authentication/employerAuthSlice';

interface Company {
  _id: string;
  name: string;
  industry: string;
  logo?: string;
}

interface CompanyListProps {
  employerData: {
    _id: string;
    employerName: string;
    email: string;
    token: string;
  };
}

const CompanyList: React.FC<CompanyListProps> = ({ employerData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`/api/company/domain-match?email=${encodeURIComponent(employerData.email)}`, {
          headers: {
            'Authorization': `Bearer ${employerData.token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        
        const data = await response.json();
        setCompanies(data.companies || []);
      } catch (err: any) {
        console.error('Error fetching companies:', err);
        setError(err.message || 'Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [employerData.email, employerData.token]);

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompany(companyId);
  };

  const handleJoinCompany = async () => {
    if (!selectedCompany) {
      setError('Please select a company to join');
      return;
    }

    setJoinLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/company/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${employerData.token}`
        },
        body: JSON.stringify({
          companyId: selectedCompany,
          employerId: employerData._id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join company');
      }

      const data = await response.json();

      // Update Redux with company data
      dispatch(
        setEmployerCredentials({
          employer_info: {
            ...employerData,
            company_id: data.company._id,
            role: data.role || 'member'
          },
          token: employerData.token,
          company: data.company
        })
      );

      navigate('/employer/dashboard');
    } catch (err: any) {
      console.error('Error joining company:', err);
      setError(err.message || 'Failed to join company');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreateCompany = () => {
    navigate('/employer/company/create', { 
      state: { employerData } 
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-8 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 p-8 rounded-xl">
      <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 text-gray-600" />
        <span className="text-gray-600">Back</span>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-50 border border-red-200 text-red-600">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {companies.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-medium text-gray-900">Join an Existing Company</h2>
          
          <div className="space-y-3">
            {companies.map((company) => (
              <div 
                key={company._id}
                className={`p-4 bg-white rounded-md border cursor-pointer transition-all ${
                  selectedCompany === company._id 
                    ? 'border-green-500 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCompanySelect(company._id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-medium">
                        {company.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{company.name}</h3>
                    <p className="text-xs text-gray-500">{company.industry}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            onClick={handleJoinCompany}
            disabled={!selectedCompany || joinLoading}
            className="w-full h-11 px-8 py-4 bg-[#001630] text-white font-medium rounded hover:bg-[#00234A] transition-colors duration-200 ease-in-out"
          >
            {joinLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Joining...
              </>
            ) : (
              'Continue'
            )}
          </Button>
          
          <div className="text-center">
            <span className="text-sm text-gray-500">or</span>
            <button 
              onClick={handleCreateCompany}
              className="block w-full mt-2 text-green-600 text-sm font-medium hover:text-green-700"
            >
              Create a new company
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center py-6">
            <h2 className="text-xl font-medium text-gray-900 mb-2">No Matching Companies Found</h2>
            <p className="text-gray-500 mb-6">We couldn't find any companies matching your email domain.</p>
            
            <Button
              onClick={handleCreateCompany}
              className="w-full h-11 px-8 py-4 bg-[#001630] text-white font-medium rounded hover:bg-[#00234A] transition-colors duration-200 ease-in-out"
            >
              Create a New Company
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;