import fs from 'fs';

let content = fs.readFileSync('src/components/ItineraryViewer.jsx', 'utf8');

// 1. Import regenerateSlot
if (!content.includes('regenerateSlot')) {
  content = content.replace(
    "import { NEIGHBOR_MAPPING, COUNTRY_REGISTRY",
    "import { regenerateSlot } from '../utils/itineraryEngine';\nimport { NEIGHBOR_MAPPING, COUNTRY_REGISTRY"
  );
}

// 2. Add states for loading and itineraryData
if (!content.includes('const [isGenerating')) {
  content = content.replace(
    "const activeItineraryData = getPolishedItinerary(destination, style, duration);",
    `const [isGenerating, setIsGenerating] = useState(false);
  const [activeItineraryData, setActiveItineraryData] = useState({});

  useEffect(() => {
    setIsGenerating(true);
    // Simulate AI processing time for premium feel
    const timer = setTimeout(() => {
      const data = getPolishedItinerary(destination, style, duration);
      setActiveItineraryData(data);
      setIsGenerating(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [destination, style, duration]);

  const handleRegenerateSlot = (dayNum, actIndex, currentCat) => {
    // Gather all currently used IDs to avoid duplicates
    const usedIds = [];
    Object.values(activeItineraryData).forEach(dayArr => {
      dayArr.forEach(act => {
        if (act.id) usedIds.push(act.id);
      });
    });

    const dayZone = ['center', 'east', 'west', 'north', 'south'][(dayNum - 1) % 5];
    const newSpot = regenerateSlot(destination.name, destination.country, style, currentCat, dayZone, usedIds);
    
    if (newSpot) {
      setActiveItineraryData(prev => {
        const newData = { ...prev };
        const newAct = { ...newData[dayNum][actIndex] };
        // Replace with new spot info
        newAct.id = newSpot.id;
        newAct.title = newAct.title.split(' ')[0] + ' ' + newSpot.name; // Keep the prefix (e.g. 🌿, 🍽️)
        newAct.desc = newSpot.desc;
        newAct.categoryType = newSpot.category || newAct.categoryType;
        newData[dayNum][actIndex] = newAct;
        return newData;
      });
    } else {
      alert(isEn ? 'No more alternative places available for this category.' : '이 카테고리의 대체 가능한 다른 장소가 더 이상 없습니다.');
    }
  };`
  );
}

// 3. Update activeItineraryData usage where it maps the Timeline
// Find the map function for dayActivities
const timelineMapRegex = /dayActivities\.map\(\(act, actIndex\) => \{([\s\S]*?)className="timeline-title"([\s\S]*?)\{\/div\}/g;
// We need to add a re-roll button. We can put it next to the title or inside the timeline-item.
// Wait, regex might be brittle. Let's just do a simple string replace for the timeline-time div to add the button next to it.
const timeDivTarget = `<div className="timeline-time" style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                              {act.time}
                            </div>`;
const timeDivReplace = `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <div className="timeline-time" style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '1.1rem' }}>
                                {act.time}
                              </div>
                              <button 
                                onClick={() => handleRegenerateSlot(dayNum, actIndex, act.categoryType)}
                                className="btn"
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: '1px solid var(--glass-border)' }}
                                title="다른 장소로 교체하기"
                              >
                                🔄 교체
                              </button>
                            </div>`;

content = content.replace(timeDivTarget, timeDivReplace);

// 4. Add the Loading overlay inside the Timeline container
const timelineHeaderTarget = `</h3>

          {/* Generate Days */}`;
const timelineHeaderReplace = `</h3>

          {isGenerating ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--color-accent)' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem auto', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{isEn ? 'AI is generating the optimal itinerary...' : 'AI가 최적의 일정을 계산 중입니다...'}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{isEn ? 'Analyzing thousands of POIs for the best route.' : '해당 도시의 수많은 명소와 테마를 분석하여 동선을 짜고 있습니다.'}</p>
            </div>
          ) : (
          /* Generate Days */`;

const timelineEndTarget = `</div>
            );
          })}
        </div>`;
const timelineEndReplace = `</div>
            );
          })
          )}
        </div>`;

if (!content.includes('AI가 최적의 일정을 계산 중입니다')) {
  content = content.replace(timelineHeaderTarget, timelineHeaderReplace);
  content = content.replace(timelineEndTarget, timelineEndReplace);
}

// Add the spinner CSS if not present
if (!content.includes('keyframes spin')) {
  content += `\n<style>
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>\n`;
}

fs.writeFileSync('src/components/ItineraryViewer.jsx', content, 'utf8');
console.log('patched ItineraryViewer');
