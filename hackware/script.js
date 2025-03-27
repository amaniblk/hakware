//chof yns ana w lyna ma3rafnach lhna w mana3arfouch js sayina m3a videos f yt mais walo alors darna haka w 9ad masiyina n5alto fih bach nafahmo maywalich yamchi
async function getPrayerTimes() {
    const city = "Algiers";  
    const country = "Algeria"; 
    const method = 2; 

    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`);
        const data = await response.json();

        if (data.code === 200) {
            const timings = data.data.timings;
            const prayerTimes = {
                Fajr: timings.Fajr,
                Dhuhr: timings.Dhuhr,
                Asr: timings.Asr,
                Maghrib: timings.Maghrib,
                Isha: timings.Isha
            };

            startCountdown(prayerTimes);
        } else {
            console.error("Error fetching prayer times:", data.status);
        }
    } catch (error) {
        console.error("Failed to fetch API:", error);
    }
}

function getNextPrayer(prayerTimes) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (let prayer in prayerTimes) {
        let [hours, minutes] = prayerTimes[prayer].split(":").map(Number);
        let prayerTime = hours * 60 + minutes;

        if (prayerTime > currentTime) {
            return { prayer, hours, minutes };
        }
    }
    return { prayer: "Fajr", hours: prayerTimes.Fajr.split(":")[0], minutes: prayerTimes.Fajr.split(":")[1] };
}

function startCountdown(prayerTimes) {
    const { prayer, hours, minutes } = getNextPrayer(prayerTimes);
    document.getElementById("nextPrayer").innerText = `Next Prayer: ${prayer}`;

    function updateCountdown() {
        const now = new Date();
        const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        if (now > targetTime) targetTime.setDate(targetTime.getDate() + 1);

        const diff = targetTime - now;
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerText = 
            `${hoursLeft.toString().padStart(2, "0")}:${minutesLeft.toString().padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;

        if (diff <= 0) {
            clearInterval(timer);
            getPrayerTimes(); 
        }
    }

    updateCountdown();
    let timer = setInterval(updateCountdown, 1000);
}


getPrayerTimes();
