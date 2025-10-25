import React, { useState } from 'react';
import { Calculator, TrendingUp, Users, Home, Heart, BookOpen, Wallet, Gift, ChevronDown, ChevronUp, Info } from 'lucide-react';

export default function YearEndTaxCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [income, setIncome] = useState('');
  const [dependents, setDependents] = useState(0);
  const [children, setChildren] = useState(0);
  const [creditCard, setCreditCard] = useState('');
  const [debitCard, setDebitCard] = useState('');
  const [medicalExpense, setMedicalExpense] = useState('');
  const [educationExpense, setEducationExpense] = useState('');
  const [pensionSaving, setPensionSaving] = useState('');
  const [insuranceExpense, setInsuranceExpense] = useState('');
  const [disabledInsurance, setDisabledInsurance] = useState('');
  const [rent, setRent] = useState('');
  const [donation, setDonation] = useState('');
  const [healthInsurance, setHealthInsurance] = useState('');
  const [employmentInsurance, setEmploymentInsurance] = useState('');
  const [housingLoan, setHousingLoan] = useState('');
  const [mortgageInterest, setMortgageInterest] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);

  // 2025년 최신 세법 반영 계산 함수
  const calculateDeductions = () => {
    const totalIncome = parseFloat(income) || 0;
    if (totalIncome === 0) return null;

    // 근로소득공제
    let incomeDeduction = 0;
    if (totalIncome <= 5000000) {
      incomeDeduction = totalIncome * 0.7;
    } else if (totalIncome <= 15000000) {
      incomeDeduction = 3500000 + (totalIncome - 5000000) * 0.4;
    } else if (totalIncome <= 45000000) {
      incomeDeduction = 7500000 + (totalIncome - 15000000) * 0.15;
    } else if (totalIncome <= 100000000) {
      incomeDeduction = 12000000 + (totalIncome - 45000000) * 0.05;
    } else {
      incomeDeduction = 14750000 + (totalIncome - 100000000) * 0.02;
    }

    // 인적공제 (1인당 150만원)
    const personalDeduction = (dependents + 1) * 1500000;

    // 보험료 소득공제 (전액)
    const insuranceDeduction = (parseFloat(healthInsurance) || 0) + (parseFloat(employmentInsurance) || 0);

    // 주택자금 소득공제
    let housingDeduction = 0;
    
    // 주택임차차입금 원리금 상환액의 40% (한도 400만원)
    const housingLoanAmount = (parseFloat(housingLoan) || 0) * 0.4;
    housingDeduction += Math.min(housingLoanAmount, 4000000);
    
    // 장기주택저당차입금 이자상환액 (전액, 상환기간별 한도)
    const mortgageAmount = parseFloat(mortgageInterest) || 0;
    if (mortgageAmount > 0) {
      // 간소화: 기본 한도 600만원 적용 (정확한 계산은 상환기간, 고정금리, 비거치식 여부 필요)
      // 실제로는: 15년 이상 + 고정금리 + 비거치식 = 2,000만원
      //          15년 이상 + (고정금리 또는 비거치식) = 1,800만원
      //          10년 이상 + (고정금리 또는 비거치식) = 800만원
      //          기타 = 600만원
      housingDeduction += Math.min(mortgageAmount, 6000000);
    }
    
    // 주택자금 공제 총합 한도 체크 (임차차입금 + 장기주택저당차입금 + 주택마련저축 합산)
    // 최대 2,000만원 (조건에 따라 다름)
    housingDeduction = Math.min(housingDeduction, 20000000);

    // 신용카드 소득공제 (연봉의 25% 초과 사용액)
    const cardUsage = (parseFloat(creditCard) || 0) + (parseFloat(debitCard) || 0);
    const cardThreshold = totalIncome * 0.25;
    let cardDeduction = 0;
    if (cardUsage > cardThreshold) {
      const excessAmount = cardUsage - cardThreshold;
      const creditCardAmount = parseFloat(creditCard) || 0;
      const debitCardAmount = parseFloat(debitCard) || 0;
      
      // 초과 사용액을 신용/체크 비율로 배분
      const creditRatio = cardUsage > 0 ? creditCardAmount / cardUsage : 0;
      const debitRatio = cardUsage > 0 ? debitCardAmount / cardUsage : 0;
      
      const creditExcess = excessAmount * creditRatio;
      const debitExcess = excessAmount * debitRatio;
      
      cardDeduction = (creditExcess * 0.15) + (debitExcess * 0.3);
      
      // 한도 적용
      if (totalIncome <= 70000000) {
        cardDeduction = Math.min(cardDeduction, 3000000);
      } else {
        cardDeduction = Math.min(cardDeduction, 2500000);
      }
    }

    // 총 소득공제
    const totalIncomeDeduction = incomeDeduction + personalDeduction + cardDeduction + insuranceDeduction + housingDeduction;

    // 과세표준 계산
    const taxBase = Math.max(0, totalIncome - totalIncomeDeduction);

    // 산출세액 계산 (2025년 세율 적용)
    let calculatedTax = 0;
    if (taxBase <= 14000000) {
      calculatedTax = taxBase * 0.06;
    } else if (taxBase <= 50000000) {
      calculatedTax = 840000 + (taxBase - 14000000) * 0.15;
    } else if (taxBase <= 88000000) {
      calculatedTax = 6240000 + (taxBase - 50000000) * 0.24;
    } else if (taxBase <= 150000000) {
      calculatedTax = 15360000 + (taxBase - 88000000) * 0.35;
    } else if (taxBase <= 300000000) {
      calculatedTax = 37060000 + (taxBase - 150000000) * 0.38;
    } else if (taxBase <= 500000000) {
      calculatedTax = 94060000 + (taxBase - 300000000) * 0.40;
    } else if (taxBase <= 1000000000){
      calculatedTax = 174060000 + (taxBase - 500000000) * 0.42;
    } else {
        calculatedTax = 384060000 + (taxBase - 1000000000) * 0.45;
      }

    // 세액공제 계산
    let taxCredit = 0;

    // 자녀세액공제 (2025년 개정)
    if (children === 1) {
      taxCredit += 250000;
    } else if (children === 2) {
      taxCredit += 550000; // 2명 55만원으로 증가
    } else if (children >= 3) {
      taxCredit += 550000 + (children - 2) * 400000; // 셋째부터 40만원씩
    }

    // 보장성보험료 세액공제
    const generalInsurance = Math.min(parseFloat(insuranceExpense) || 0, 1000000); // 한도 100만원
    taxCredit += generalInsurance * 0.12; // 12%
    
    const disabledInsuranceAmount = Math.min(parseFloat(disabledInsurance) || 0, 1000000); // 한도 100만원
    taxCredit += disabledInsuranceAmount * 0.15; // 15%

    // 의료비 세액공제
    const medicalAmount = parseFloat(medicalExpense) || 0;
    const medicalThreshold = totalIncome * 0.03; // 총급여 3% 초과분
    const medicalExcess = Math.max(0, medicalAmount - medicalThreshold);
    
    // 일반 의료비: 700만원 한도, 15%
    // (실제로는 본인/65세이상/장애인/6세이하는 한도 없음 - 간소화)
    taxCredit += Math.min(medicalExcess, 7000000) * 0.15;

    // 교육비 세액공제 (15%)
    // 본인: 전액, 초중고: 300만원, 대학생: 900만원 (간소화)
    const educationAmount = parseFloat(educationExpense) || 0;
    taxCredit += educationAmount * 0.15;

    // 연금저축 세액공제 (한도 900만원, 12-15%)
    const pensionAmount = Math.min(parseFloat(pensionSaving) || 0, 9000000);
    const pensionRate = totalIncome <= 55000000 ? 0.15 : 0.12;
    taxCredit += pensionAmount * pensionRate;

    // 월세 세액공제 (15-17%, 총급여 8000만원 이하)
    if (totalIncome <= 80000000) {
      const rentAmount = Math.min(parseFloat(rent) || 0, 10000000);
      const rentRate = totalIncome <= 55000000 ? 0.17 : 0.15;
      taxCredit += rentAmount * rentRate;
    }

    // 기부금 세액공제 (15-30%)
    const donationAmount = parseFloat(donation) || 0;
    // 1천만원 이하: 15%, 초과분: 30%
    taxCredit += Math.min(donationAmount, 10000000) * 0.15 + Math.max(0, donationAmount - 10000000) * 0.30;

    // 결정세액
    const finalTax = Math.max(0, calculatedTax - taxCredit);

    return {
      totalIncome,
      incomeDeduction,
      personalDeduction,
      cardDeduction,
      insuranceDeduction,
      housingDeduction,
      totalIncomeDeduction,
      taxBase,
      calculatedTax,
      taxCredit,
      finalTax,
      estimatedRefund: calculatedTax * 0.1 // 예상 환급액 (간이 추정)
    };
  };

  const result = calculateDeductions();

  const taxInfo2025 = [
    {
      title: '자녀세액공제 확대',
      icon: <Users className="w-5 h-5" />,
      description: '2자녀 35만원(기존 30만원), 셋째부터 1인당 40만원 추가',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: '의료비 공제 개선',
      icon: <Heart className="w-5 h-5" />,
      description: '만 6세 이하 의료비 한도 폐지, 산후조리원비 소득 기준 폐지',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: '월세 세액공제 확대',
      icon: <Home className="w-5 h-5" />,
      description: '소득기준 7천만원→8천만원, 한도 750만원→1000만원',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: '연금저축 한도 증가',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'IRP+연금저축 합산 한도 700만원→900만원',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      title: '결혼 세액공제 신설',
      icon: <Gift className="w-5 h-5" />,
      description: '2024-2026년 혼인신고자 1인당 50만원(생애 1회)',
      color: 'bg-pink-50 border-pink-200'
    },
    {
      title: '신용카드 추가공제',
      icon: <Wallet className="w-5 h-5" />,
      description: '전년 대비 5% 이상 사용 시 초과분의 10% 추가공제(한도 100만원)',
      color: 'bg-yellow-50 border-yellow-200'
    }
  ];

  const deductionTips = [
    {
      category: '소득공제',
      items: [
        '연봉의 25%까지는 신용카드 공제 미적용 - 이 구간은 체크카드 사용',
        '25% 초과 구간부터 신용카드 15%, 체크카드 30%, 대중교통 80% 공제',
        '부양가족 1인당 150만원 기본공제 (연소득 100만원 이하)',
        '주택청약저축 납입액 40% 공제 (한도 연 300만원)',
        '보험료(건강보험, 고용보험)는 본인 부담분 전액 공제'
      ]
    },
    {
      category: '주택자금 공제 상세',
      items: [
        '장기주택저당차입금: 취득시 기준시가 6억원 이하, 무주택/1주택 세대주',
        '상환기간 15년 이상 + 고정금리 + 비거치식: 최대 2,000만원',
        '상환기간 15년 이상 + (고정금리 또는 비거치식): 최대 1,800만원',
        '상환기간 10년 이상 + (고정금리 또는 비거치식): 최대 800만원',
        '기타 조건: 최대 600만원 (등기일부터 3개월 이내 차입 필수)'
      ]
    },
    {
      category: '세액공제 - 보험료',
      items: [
        '보장성보험료(생명보험, 상해보험): 연 100만원 한도, 12% 공제',
        '장애인전용 보장성보험료: 연 100만원 한도, 15% 공제',
        '보장성보험은 기본공제 대상자를 위해 지출한 보험료만 해당',
        '저축성 보험은 제외 - 반드시 보장성 보험이어야 공제 가능'
      ]
    },
    {
      category: '세액공제 - 의료비',
      items: [
        '총급여의 3%를 초과하는 금액만 공제 (15%)',
        '본인/6세 이하/65세 이상/장애인 의료비: 한도 없음',
        '일반 기본공제대상자: 연 700만원 한도',
        '미숙아·선천성이상아: 20% 공제, 난임시술비: 30% 공제',
        '산후조리원 비용: 출산 1회당 200만원 한도 (소득제한 폐지)'
      ]
    },
    {
      category: '세액공제 - 교육비/기부금',
      items: [
        '교육비 15% 공제: 본인 전액, 초중고 300만원, 대학생 900만원',
        '연금저축+IRP 최대 900만원 납입 시 최대 148만원 환급',
        '기부금: 1천만원 이하 15%, 초과분 30% 공제',
        '고향사랑기부제 10만원 기부 시 10만원 세액공제 + 3만원 답례품 (100/110)',
        '월세 세액공제: 총급여 8천만원 이하, 한도 1,000만원 (15-17%)'
      ]
    },
    {
      category: '절세 전략',
      items: [
        '12월까지 의료비, 교육비 지출 계획 세우기',
        '연금저축 납입 여력 확인하고 12월 말까지 납입',
        '보장성보험 100만원 납부 시 최대 12만원 환급',
        '홈택스 연말정산 미리보기로 10-12월 지출 계획 수립',
        '누락되기 쉬운 안경 구입비, 교복비 현금영수증 챙기기',
        '주택담보대출은 조건 충족 시 이자상환액 소득공제 가능'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg mb-4">
            <Calculator className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">2025 연말정산 계산기</h1>
          </div>
          <p className="text-gray-600">2024년 귀속 최신 세법 반영</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-xl shadow-lg mb-8 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'calculator'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calculator className="w-5 h-5 inline mr-2" />
            연말정산 계산기
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'info'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Info className="w-5 h-5 inline mr-2" />
            2025년 달라진 점
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'tips'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            절세 팁
          </button>
        </div>

        {/* 계산기 탭 */}
        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 입력 영역 */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  기본 정보
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      연간 총급여 (원)
                    </label>
                    <input
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      placeholder="50000000"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        부양가족 수 (본인 제외)
                      </label>
                      <input
                        type="number"
                        value={dependents}
                        onChange={(e) => setDependents(parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        자녀 수
                      </label>
                      <input
                        type="number"
                        value={children}
                        onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-blue-600" />
                  소득·세액공제 항목
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        신용카드 사용액 (연간)
                      </label>
                      <input
                        type="number"
                        value={creditCard}
                        onChange={(e) => setCreditCard(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        체크카드 사용액 (연간)
                      </label>
                      <input
                        type="number"
                        value={debitCard}
                        onChange={(e) => setDebitCard(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      의료비 지출액 (연간)
                    </label>
                    <input
                      type="number"
                      value={medicalExpense}
                      onChange={(e) => setMedicalExpense(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      교육비 지출액 (연간)
                    </label>
                    <input
                      type="number"
                      value={educationExpense}
                      onChange={(e) => setEducationExpense(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      연금저축 납입액 (연간)
                    </label>
                    <input
                      type="number"
                      value={pensionSaving}
                      onChange={(e) => setPensionSaving(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        보장성보험료 (일반)
                      </label>
                      <input
                        type="number"
                        value={insuranceExpense}
                        onChange={(e) => setInsuranceExpense(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">한도 100만원, 12% 공제</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        장애인전용 보험료
                      </label>
                      <input
                        type="number"
                        value={disabledInsurance}
                        onChange={(e) => setDisabledInsurance(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">한도 100만원, 15% 공제</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      월세 지출액 (연간)
                    </label>
                    <input
                      type="number"
                      value={rent}
                      onChange={(e) => setRent(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        건강보험료 (본인부담)
                      </label>
                      <input
                        type="number"
                        value={healthInsurance}
                        onChange={(e) => setHealthInsurance(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">노인장기요양보험 포함</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        고용보험료 (본인부담)
                      </label>
                      <input
                        type="number"
                        value={employmentInsurance}
                        onChange={(e) => setEmploymentInsurance(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        주택임차차입금 원리금
                      </label>
                      <input
                        type="number"
                        value={housingLoan}
                        onChange={(e) => setHousingLoan(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">상환액의 40% 공제</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        장기주택저당차입금 이자
                      </label>
                      <input
                        type="number"
                        value={mortgageInterest}
                        onChange={(e) => setMortgageInterest(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">이자상환액 (조건별 한도 상이)</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      기부금
                    </label>
                    <input
                      type="number"
                      value={donation}
                      onChange={(e) => setDonation(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 결과 영역 */}
            <div className="space-y-4">
              {result ? (
                <>
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">예상 환급액</h3>
                    <div className="text-4xl font-bold mb-2">
                      {result.estimatedRefund.toLocaleString()}원
                    </div>
                    <p className="text-blue-100">* 간이 추정치입니다</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">상세 계산 내역</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">총급여</span>
                        <span className="font-semibold">{result.totalIncome.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">근로소득공제</span>
                        <span className="font-semibold text-blue-600">
                          -{result.incomeDeduction.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">인적공제</span>
                        <span className="font-semibold text-blue-600">
                          -{result.personalDeduction.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">신용카드 공제</span>
                        <span className="font-semibold text-blue-600">
                          -{result.cardDeduction.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">보험료 공제</span>
                        <span className="font-semibold text-blue-600">
                          -{result.insuranceDeduction.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">주택자금 공제</span>
                        <span className="font-semibold text-blue-600">
                          -{result.housingDeduction.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-400">
                        <span className="text-gray-800 font-semibold">과세표준</span>
                        <span className="font-bold">{result.taxBase.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">산출세액</span>
                        <span className="font-semibold text-red-600">
                          {result.calculatedTax.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">세액공제</span>
                        <span className="font-semibold text-blue-600">
                          -{result.taxCredit.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex justify-between py-3 bg-gray-50 px-3 rounded-lg">
                        <span className="text-gray-800 font-bold text-lg">결정세액</span>
                        <span className="font-bold text-lg text-purple-600">
                          {result.finalTax.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-gray-700">
                      <strong>💡 Tip:</strong> 실제 환급액은 기납부 세액과 비교하여 결정됩니다. 
                      정확한 계산은 홈택스의 '연말정산 미리보기' 서비스를 이용하세요.
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <Calculator className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    좌측에 정보를 입력하시면<br />
                    예상 환급액을 계산해드립니다
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2025년 달라진 점 탭 */}
        {activeTab === 'info' && (
          <div className="grid md:grid-cols-2 gap-4">
            {taxInfo2025.map((info, index) => (
              <div
                key={index}
                className={`${info.color} border-2 rounded-xl p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{info.title}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{info.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 절세 팁 탭 */}
        {activeTab === 'tips' && (
          <div className="space-y-4">
            {deductionTips.map((section, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-800">{section.category}</h3>
                  </div>
                  {expandedSection === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedSection === index && (
                  <div className="px-6 pb-6 space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {itemIndex + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🎯 연말정산 일정</h3>
              <div className="space-y-2 text-sm">
                <p>• <strong>1월 15일</strong>: 간소화 서비스 오픈</p>
                <p>• <strong>1월 20일</strong>: 소득·세액공제 신고서 제출</p>
                <p>• <strong>2월</strong>: 회사의 연말정산 처리 및 결과 안내</p>
                <p>• <strong>3월 10일</strong>: 회사의 원천징수이행상황 신고</p>
              </div>
            </div>
          </div>
        )}

        {/* 푸터 */}
        <div className="mt-12 text-center text-gray-500 text-sm pb-8">
          <p>📌 2025년 최신 세법 반영 (2024년 귀속)</p>
          <p className="mt-2">정확한 계산은 국세청 홈택스를 이용하세요</p>
          <a 
            href="https://www.hometax.go.kr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            홈택스 바로가기 →
          </a>
        </div>
      </div>
    </div>
  );
}
