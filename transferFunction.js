// Convert coordinates to polar coordinates
function toPolar(x, y) {
    let real = x - 200;
    real = real / 200;
    let imag = 200 - y;
    imag = imag / 200;
    let mag = real;
    let phase = imag;
    return {mag, phase};
}

function transferFunction(zeros,poles)
{
    let num = [1];
    let den = [1];
    for (let i = 0; i < zeros.length; i++)
    {
        let {mag, phase} = toPolar(zeros[i].x, zeros[i].y);
        num = conv(num, [1, -mag]);
    }
    for (let i = 0; i < poles.length; i++)
    {
        let {mag, phase} = toPolar(poles[i].x, poles[i].y);
        den = conv(den, [1, -mag]);
    }
    return [num, den];
}

function conv(a,b)
{
    let c = [];
    for (let i = 0; i < a.length + b.length - 1; i++)
    {
        c[i] = 0;
        for (let j = 0; j < a.length; j++)
        {
            if (i - j >= 0 && i - j < b.length)
            {
                c[i] += a[j] * b[i - j];
            }
        }
    }
    return c;
}

function freqz(num,den,freqLength)
{
    let w = [];
    let h = [];
    for (let i = 0; i < freqLength; i++)
    {
        w[i] = i * Math.PI / freqLength;
        let numSum = math.complex(0, 0);
        let denSum = math.complex(0, 0);
        for (let j = 0; j < num.length; j++)
        {
            numSum = math.add(numSum, math.multiply(num[j], math.complex(Math.cos(w[i] * j), -Math.sin(w[i] * j))));
        }
        for (let j = 0; j < den.length; j++)
        {
            denSum = math.add(denSum, math.multiply(den[j], math.complex(Math.cos(w[i] * j), -Math.sin(w[i] * j))));
        }

        h[i] = math.divide(numSum, denSum);
    }
    return [w, h];
}