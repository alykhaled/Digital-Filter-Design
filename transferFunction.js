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

function transferFunction(zeros, poles) {
    let num = [{ real: 1, imag: 0 }];
    let den = [{ real: 1, imag: 0 }];
    for (let i = 0; i < zeros.length; i++) {
      let { mag, phase } = toPolar(zeros[i].x, zeros[i].y);
      num = conv(num, [{ real: 1, imag: 0 }, { real: -mag, imag: -phase }]);
    }
    for (let i = 0; i < poles.length; i++) {
      let { mag, phase } = toPolar(poles[i].x, poles[i].y);
      den = conv(den, [{ real: 1, imag: 0 }, { real: -mag, imag: -phase }]);
    }
    return [num, den];
}

function conv(a, b) {
    let c = [];
    for (let i = 0; i < a.length + b.length - 1; i++) {
      c[i] = { real: 0, imag: 0 };
      for (let j = 0; j < a.length; j++) {
        if (i - j >= 0 && i - j < b.length) {
          c[i].real += a[j].real * b[i - j].real - a[j].imag * b[i - j].imag;
          c[i].imag += a[j].real * b[i - j].imag + a[j].imag * b[i - j].real;
        }
      }
    }correctedZeroes
    return c;
} 

function freqz(num,den,freqLength)
{
  /*
    Calculates the frequency response of a filter given its numerator and denominator coefficients.
    params:
        num: array of numerator coefficients
        den: array of denominator coefficients
        freqLength: number of frequency points to calculate
    returns:
        w: array of frequencies
        h: array of frequency response values

                jw                 -jw              -jwM
        jw    B(e  )    b[0] + b[1]e    + ... + b[M]e
     H(e  ) = ------ = -----------------------------------
                 jw                 -jw              -jwN
              A(e  )    a[0] + a[1]e    + ... + a[N]e
  */
    let w = [];
    let h = [];
    for (let i = 0; i < freqLength; i++)
    {
        w[i] = i * Math.PI / freqLength;
        let numSum = math.complex(0, 0);
        let denSum = math.complex(0, 0);
        for (let j = 0; j < num.length; j++)
        {
            let temp = math.complex(num[j].real, num[j].imag);
            numSum = math.add(numSum, math.multiply(temp, math.complex(Math.cos(w[i] * j), -Math.sin(w[i] * j))));
        }
        for (let j = 0; j < den.length; j++)
        {
            let temp = math.complex(den[j].real, den[j].imag);
            denSum = math.add(denSum, math.multiply(temp, math.complex(Math.cos(w[i] * j), -Math.sin(w[i] * j))));
        }

        h[i] = math.divide(numSum, denSum);
    }
    return [w, h];
}