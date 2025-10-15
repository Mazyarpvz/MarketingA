/**
 * اسکریپت تست خودکار برای بررسی تمام اجزای UI
 */

interface TestResult {
  component: string;
  test: string;
  status: 'pass' | 'fail';
  message: string;
}

const results: TestResult[] = [];

function logTest(component: string, test: string, status: 'pass' | 'fail', message: string) {
  results.push({ component, test, status, message });
  const icon = status === 'pass' ? '✅' : '❌';
  console.log(`${icon} [${component}] ${test}: ${message}`);
}

// Test 1: بررسی Sidebar buttons
function testSidebarButtons() {
  console.log('\n🔍 Testing Sidebar Buttons...');
  
  const buttons = document.querySelectorAll('aside button');
  if (buttons.length === 0) {
    logTest('Sidebar', 'Button Existence', 'fail', 'هیچ دکمه‌ای پیدا نشد');
    return;
  }
  
  logTest('Sidebar', 'Button Existence', 'pass', `${buttons.length} دکمه پیدا شد`);
  
  buttons.forEach((button, index) => {
    // Check hover styles
    const hasHoverClass = button.className.includes('hover:');
    logTest('Sidebar', `Button ${index + 1} - Hover`, hasHoverClass ? 'pass' : 'fail', 
      hasHoverClass ? 'دارای hover effect' : 'فاقد hover effect');
    
    // Check transition
    const hasTransition = button.className.includes('transition');
    logTest('Sidebar', `Button ${index + 1} - Transition`, hasTransition ? 'pass' : 'fail',
      hasTransition ? 'دارای transition' : 'فاقد transition');
    
    // Check cursor
    const style = window.getComputedStyle(button);
    const hasCursor = style.cursor === 'pointer';
    logTest('Sidebar', `Button ${index + 1} - Cursor`, hasCursor ? 'pass' : 'fail',
      hasCursor ? 'دارای cursor: pointer' : 'فاقد cursor: pointer');
  });
}

// Test 2: بررسی KPI Cards
function testKpiCards() {
  console.log('\n🔍 Testing KPI Cards...');
  
  const cards = document.querySelectorAll('[class*="backdrop-blur"]');
  if (cards.length === 0) {
    logTest('KPI Cards', 'Card Existence', 'fail', 'هیچ کارتی پیدا نشد');
    return;
  }
  
  logTest('KPI Cards', 'Card Existence', 'pass', `${cards.length} کارت پیدا شد`);
  
  cards.forEach((card, index) => {
    const element = card as HTMLElement;
    
    // Check hover effect
    const hasHoverEffect = element.className.includes('hover:');
    logTest('KPI Cards', `Card ${index + 1} - Hover`, hasHoverEffect ? 'pass' : 'fail',
      hasHoverEffect ? 'دارای hover effect' : 'فاقد hover effect');
    
    // Check shadow
    const hasShadow = element.className.includes('shadow');
    logTest('KPI Cards', `Card ${index + 1} - Shadow`, hasShadow ? 'pass' : 'fail',
      hasShadow ? 'دارای shadow' : 'فاقد shadow');
  });
}

// Test 3: بررسی Links
function testLinks() {
  console.log('\n🔍 Testing Links...');
  
  const links = document.querySelectorAll('a');
  if (links.length === 0) {
    logTest('Links', 'Link Existence', 'pass', 'هیچ لینکی وجود ندارد');
    return;
  }
  
  logTest('Links', 'Link Existence', 'pass', `${links.length} لینک پیدا شد`);
  
  links.forEach((link, index) => {
    const hasHoverClass = link.className.includes('hover:');
    logTest('Links', `Link ${index + 1} - Hover`, hasHoverClass ? 'pass' : 'fail',
      hasHoverClass ? 'دارای hover effect' : 'فاقد hover effect');
    
    const style = window.getComputedStyle(link);
    const hasCursor = style.cursor === 'pointer' || style.cursor === 'default';
    logTest('Links', `Link ${index + 1} - Cursor`, hasCursor ? 'pass' : 'fail',
      hasCursor ? `cursor: ${style.cursor}` : 'فاقد cursor مناسب');
  });
}

// Test 4: بررسی Interactive Elements
function testInteractiveElements() {
  console.log('\n🔍 Testing Interactive Elements...');
  
  const interactive = document.querySelectorAll('button, a, input, select, textarea');
  if (interactive.length === 0) {
    logTest('Interactive', 'Element Existence', 'fail', 'هیچ المنت تعاملی پیدا نشد');
    return;
  }
  
  logTest('Interactive', 'Element Existence', 'pass', `${interactive.length} المنت تعاملی پیدا شد`);
  
  let passCount = 0;
  interactive.forEach((element) => {
    const style = window.getComputedStyle(element);
    if (style.cursor === 'pointer' || style.cursor === 'text' || element.tagName === 'INPUT') {
      passCount++;
    }
  });
  
  const percentage = (passCount / interactive.length) * 100;
  logTest('Interactive', 'Cursor Style', percentage > 80 ? 'pass' : 'fail',
    `${percentage.toFixed(0)}% المنت‌ها دارای cursor مناسب هستند`);
}

// Test 5: بررسی Animations
function testAnimations() {
  console.log('\n🔍 Testing Animations...');
  
  const animated = document.querySelectorAll('[class*="animate-"], [class*="transition"]');
  if (animated.length === 0) {
    logTest('Animations', 'Animation Existence', 'fail', 'هیچ انیمیشنی پیدا نشد');
    return;
  }
  
  logTest('Animations', 'Animation Existence', 'pass', `${animated.length} المنت دارای انیمیشن`);
}

// Test 6: بررسی Focus States
function testFocusStates() {
  console.log('\n🔍 Testing Focus States...');
  
  const focusable = document.querySelectorAll('button, a, input, select, textarea');
  let hasFocusStyles = 0;
  
  focusable.forEach((element) => {
    if (element.className.includes('focus:')) {
      hasFocusStyles++;
    }
  });
  
  const percentage = focusable.length > 0 ? (hasFocusStyles / focusable.length) * 100 : 0;
  logTest('Focus', 'Focus Styles', percentage > 50 ? 'pass' : 'fail',
    `${percentage.toFixed(0)}% المنت‌ها دارای focus styles`);
}

// Run all tests
export function runAllTests() {
  console.log('🚀 شروع تست خودکار UI...\n');
  
  setTimeout(() => {
    testSidebarButtons();
    testKpiCards();
    testLinks();
    testInteractiveElements();
    testAnimations();
    testFocusStates();
    
    // Summary
    console.log('\n📊 خلاصه نتایج:');
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    console.log(`✅ موفق: ${passed}`);
    console.log(`❌ ناموفق: ${failed}`);
    console.log(`📈 درصد موفقیت: ${((passed / results.length) * 100).toFixed(0)}%`);
    
    if (failed > 0) {
      console.log('\n⚠️ مشکلات یافت شده:');
      results.filter(r => r.status === 'fail').forEach(r => {
        console.log(`   - [${r.component}] ${r.test}: ${r.message}`);
      });
    }
    
    return results;
  }, 2000); // Wait for page to load
}

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    (window as any).runUITests = runAllTests;
    console.log('💡 برای اجرای تست‌ها در console تایپ کنید: runUITests()');
  }
}
